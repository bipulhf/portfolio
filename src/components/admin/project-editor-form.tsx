import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import {
  createProjectRequest,
  deleteProjectRequest,
  queryKeys,
  updateProjectRequest,
  uploadImageRequest,
} from '~/lib/admin-queries'
import type { ProjectFormState } from '~/lib/api/types'
import { LexicalRichEditor } from '~/components/editor/lexical-rich-editor'
import { useUnsavedChangesWarning } from './use-unsaved-changes-warning'
import { ImagePathField } from './image-path-field'
import { listToString, stringToList } from './form-state'
import { AdminCard, AdminCheckbox, AdminField, AdminInput, AdminSectionHeading, AdminSelect, AdminTextarea } from './primitives'

function normalizePublishedAt(value: string) {
  if (!value) {
    return ''
  }

  return value.includes('Z') ? value : new Date(value).toISOString()
}

export function ProjectEditorForm({
  initialState,
  projectId,
}: Readonly<{
  initialState: ProjectFormState
  projectId?: string
}>) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [values, setValues] = useState(initialState)
  const [baseline, setBaseline] = useState(() => JSON.stringify(initialState))

  useEffect(() => {
    setValues(initialState)
    setBaseline(JSON.stringify(initialState))
  }, [initialState])

  const isDirty = JSON.stringify(values) !== baseline

  useUnsavedChangesWarning(isDirty)

  const saveMutation = useMutation({
    mutationFn: async (status: 'draft' | 'published') => {
      const payload: ProjectFormState = {
        ...values,
        status,
        publishedAt:
          status === 'published'
            ? normalizePublishedAt(values.publishedAt ?? '') || new Date().toISOString()
            : '',
      }

      return projectId
        ? updateProjectRequest(projectId, payload)
        : createProjectRequest(payload)
    },
    onSuccess: async (project) => {
      toast.success(project.status === 'published' ? 'Project published.' : 'Draft saved.')
      await queryClient.invalidateQueries({ queryKey: queryKeys.projects })
      await queryClient.invalidateQueries({ queryKey: queryKeys.project(project.id) })
      const nextState = {
        title: project.title,
        slug: project.slug,
        summary: project.summary,
        excerpt: project.excerpt,
        coverImagePath: project.coverImagePath ?? '',
        seoTitle: project.seoTitle ?? '',
        seoDescription: project.seoDescription ?? '',
        ogImagePath: project.ogImagePath ?? '',
        bodyJson: project.bodyJson,
        bodyHtml: project.bodyHtml,
        status: project.status,
        publishedAt: project.publishedAt ?? '',
        techStack: project.techStack,
        liveUrl: project.liveUrl ?? '',
        repoUrl: project.repoUrl ?? '',
        featured: project.featured,
      }
      setValues(nextState)
      setBaseline(JSON.stringify(nextState))

      if (!projectId) {
        await navigate({
          to: '/admin/projects/$id/edit',
          params: { id: project.id },
        })
      }
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to save project.')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!projectId) {
        return
      }

      return deleteProjectRequest(projectId)
    },
    onSuccess: async () => {
      toast.success('Project deleted.')
      await queryClient.invalidateQueries({ queryKey: queryKeys.projects })
      await navigate({ to: '/admin/projects' })
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to delete project.')
    },
  })

  return (
    <form
      className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="space-y-6">
        <AdminCard>
          <AdminSectionHeading eyebrow="overview" title="Project details" />
          <div className="grid gap-4 md:grid-cols-2">
            <AdminField label="Title">
              <AdminInput
                onChange={(event) => setValues((current) => ({ ...current, title: event.target.value }))}
                placeholder="A calm but capable product title"
                value={values.title}
              />
            </AdminField>
            <AdminField help="Leave blank to generate from the title." label="Slug">
              <AdminInput
                onChange={(event) => setValues((current) => ({ ...current, slug: event.target.value }))}
                placeholder="my-project-slug"
                value={values.slug ?? ''}
              />
            </AdminField>
          </div>
          <div className="mt-4 grid gap-4">
            <AdminField label="Summary">
              <AdminTextarea
                onChange={(event) => setValues((current) => ({ ...current, summary: event.target.value }))}
                placeholder="What this project is and why it matters."
                value={values.summary}
              />
            </AdminField>
            <AdminField help="Short version for cards and metadata." label="Excerpt">
              <AdminTextarea
                className="min-h-24"
                onChange={(event) => setValues((current) => ({ ...current, excerpt: event.target.value }))}
                placeholder="Short supporting description."
                value={values.excerpt ?? ''}
              />
            </AdminField>
            <AdminField help="Comma-separated values." label="Tech stack">
              <AdminInput
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    techStack: stringToList(event.target.value),
                  }))
                }
                placeholder="TanStack Start, Tailwind, Drizzle"
                value={listToString(values.techStack)}
              />
            </AdminField>
          </div>
        </AdminCard>

        <AdminCard>
          <AdminSectionHeading eyebrow="story" title="Case study body" />
          <LexicalRichEditor
            onChange={({ bodyHtml, bodyJson }) =>
              setValues((current) => ({
                ...current,
                bodyHtml,
                bodyJson,
              }))
            }
            onUploadImage={async (file) => {
              const upload = await uploadImageRequest(file)
              toast.success('Inline image added.')
              return upload.publicPath
            }}
            placeholder="Walk through the challenge, your process, tradeoffs, and outcomes..."
            valueHtml={values.bodyHtml}
            valueJson={values.bodyJson}
          />
        </AdminCard>
      </div>

      <div className="space-y-6">
        <AdminCard>
          <AdminSectionHeading eyebrow="publish" title="Visibility" />
          <div className="space-y-4">
            <AdminField label="Status">
              <AdminSelect
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    status: event.target.value as 'draft' | 'published',
                  }))
                }
                value={values.status}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </AdminSelect>
            </AdminField>
            <AdminField help="Optional. Leave empty to use publish time." label="Published at">
              <AdminInput
                onChange={(event) => setValues((current) => ({ ...current, publishedAt: event.target.value }))}
                type="datetime-local"
                value={values.publishedAt ? values.publishedAt.slice(0, 16) : ''}
              />
            </AdminField>
            <AdminCheckbox
              checked={values.featured}
              help="Featured projects are prioritized on the public site."
              label="Feature this project"
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  featured: event.target.checked,
                }))
              }
            />
          </div>
        </AdminCard>

        <AdminCard>
          <AdminSectionHeading eyebrow="links" title="URLs and media" />
          <div className="space-y-4">
            <AdminField label="Live URL">
              <AdminInput
                onChange={(event) => setValues((current) => ({ ...current, liveUrl: event.target.value }))}
                placeholder="https://example.com"
                value={values.liveUrl ?? ''}
              />
            </AdminField>
            <AdminField label="Repository URL">
              <AdminInput
                onChange={(event) => setValues((current) => ({ ...current, repoUrl: event.target.value }))}
                placeholder="https://github.com/..."
                value={values.repoUrl ?? ''}
              />
            </AdminField>
            <ImagePathField
              help="Shown in cards and detail page hero."
              label="Cover image"
              onChange={(value) => setValues((current) => ({ ...current, coverImagePath: value }))}
              value={values.coverImagePath ?? ''}
            />
            <ImagePathField
              help="Optional social preview override."
              label="Open Graph image"
              onChange={(value) => setValues((current) => ({ ...current, ogImagePath: value }))}
              value={values.ogImagePath ?? ''}
            />
          </div>
        </AdminCard>

        <AdminCard>
          <AdminSectionHeading eyebrow="seo" title="Search metadata" />
          <div className="space-y-4">
            <AdminField label="SEO title">
              <AdminInput
                onChange={(event) => setValues((current) => ({ ...current, seoTitle: event.target.value }))}
                placeholder="Optional override"
                value={values.seoTitle ?? ''}
              />
            </AdminField>
            <AdminField label="SEO description">
              <AdminTextarea
                className="min-h-24"
                onChange={(event) =>
                  setValues((current) => ({ ...current, seoDescription: event.target.value }))
                }
                placeholder="Optional override for search snippets."
                value={values.seoDescription ?? ''}
              />
            </AdminField>
          </div>
        </AdminCard>

        <AdminCard>
          <div className="flex flex-wrap gap-3">
            <button
              className="inline-flex min-h-12 flex-1 items-center justify-center rounded-[1rem] border-2 border-ink bg-yellow px-4 py-3 font-hand text-xl text-ink shadow-crayon-sm transition-transform hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-70"
              disabled={saveMutation.isPending || deleteMutation.isPending}
              onClick={() => saveMutation.mutate('draft')}
              type="button"
            >
              {saveMutation.isPending && values.status !== 'published' ? 'Saving...' : 'Save draft'}
            </button>
            <button
              className="inline-flex min-h-12 flex-1 items-center justify-center rounded-[1rem] border-2 border-ink bg-mint px-4 py-3 font-hand text-xl text-ink shadow-crayon-sm transition-transform hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-70"
              disabled={saveMutation.isPending || deleteMutation.isPending}
              onClick={() => saveMutation.mutate('published')}
              type="button"
            >
              {saveMutation.isPending && values.status === 'published' ? 'Publishing...' : 'Publish'}
            </button>
          </div>
          {projectId ? (
            <button
              className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-[0.95rem] border-2 border-dashed border-ink bg-transparent px-4 py-3 font-hand text-lg text-ink transition-colors hover:bg-peach/45 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={deleteMutation.isPending || saveMutation.isPending}
              onClick={() => {
                if (window.confirm('Delete this project? This cannot be undone.')) {
                  deleteMutation.mutate()
                }
              }}
              type="button"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete project'}
            </button>
          ) : null}
        </AdminCard>
      </div>
    </form>
  )
}
