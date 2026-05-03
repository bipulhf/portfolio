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
      toast.success(project.status === 'published' ? 'Project is live.' : 'Draft saved.')
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
      toast.error(error instanceof Error ? error.message : "We couldn't save this project.")
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
      toast.error(error instanceof Error ? error.message : "We couldn't delete this project.")
    },
  })

  return (
    <form
      className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_19.5rem]"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="space-y-6">
        <AdminCard>
          <AdminSectionHeading eyebrow="Step 1" title="Basics" />
          <div className="grid gap-4 md:grid-cols-2">
            <AdminField label="Title">
              <AdminInput
                onChange={(event) => setValues((current) => ({ ...current, title: event.target.value }))}
                placeholder="Project title"
                value={values.title}
              />
            </AdminField>
            <AdminField help="Leave this blank to generate it from the title." label="Slug">
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
                placeholder="What the project is, who it helps, and why it matters."
                value={values.summary}
              />
            </AdminField>
            <AdminField help="Shown on cards and in search previews." label="Excerpt">
              <AdminTextarea
                className="min-h-24"
                onChange={(event) => setValues((current) => ({ ...current, excerpt: event.target.value }))}
                placeholder="Short summary for cards and previews."
                value={values.excerpt ?? ''}
              />
            </AdminField>
            <AdminField help="Separate tools with commas." label="Tech stack">
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
          <AdminSectionHeading eyebrow="Step 2" title="Write the case study" />
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
              toast.success('Image added to the case study.')
              return upload.publicPath
            }}
            placeholder="Explain the challenge, your approach, the tradeoffs, and the outcome..."
            valueHtml={values.bodyHtml}
            valueJson={values.bodyJson}
          />
        </AdminCard>
      </div>

      <div className="space-y-6 xl:sticky xl:top-24 xl:self-start">
        <AdminCard>
          <AdminSectionHeading eyebrow="Step 3" title="Review and publish" />
          <p className="mb-4 text-sm text-ink-soft">
            Keep this in draft while you write. Publish when the copy, images, and links are ready.
          </p>
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
            <AdminField help="Optional. Leave blank to use the time you publish." label="Published at">
              <AdminInput
                onChange={(event) => setValues((current) => ({ ...current, publishedAt: event.target.value }))}
                type="datetime-local"
                value={values.publishedAt ? values.publishedAt.slice(0, 16) : ''}
              />
            </AdminField>
            <AdminCheckbox
              checked={values.featured}
              help="Featured projects can appear more prominently on the public site."
              label="Feature this project"
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  featured: event.target.checked,
                }))
              }
            />
          </div>
          <div className="mt-5 flex flex-col gap-3">
            <button
              className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-ink px-4 py-3 text-sm font-semibold text-paper transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={saveMutation.isPending || deleteMutation.isPending}
              onClick={() => saveMutation.mutate('draft')}
              type="button"
            >
              {saveMutation.isPending && values.status !== 'published' ? 'Saving draft...' : 'Save draft'}
            </button>
            <button
              className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-mint px-4 py-3 text-sm font-semibold text-ink transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={saveMutation.isPending || deleteMutation.isPending}
              onClick={() => saveMutation.mutate('published')}
              type="button"
            >
              {saveMutation.isPending && values.status === 'published' ? 'Publishing project...' : 'Publish project'}
            </button>
          </div>
          {projectId ? (
            <button
              className="mt-4 inline-flex min-h-10 w-full items-center justify-center rounded-full border border-red-300 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={deleteMutation.isPending || saveMutation.isPending}
              onClick={() => {
                if (window.confirm("Delete this project permanently? This can't be undone.")) {
                  deleteMutation.mutate()
                }
              }}
              type="button"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete project'}
            </button>
          ) : null}
        </AdminCard>

        <AdminCard>
          <AdminSectionHeading eyebrow="Optional" title="Links and images" />
          <div className="space-y-4">
            <AdminField label="Live site URL">
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
              help="Shown on project cards and at the top of the project page."
              label="Cover image"
              onChange={(value) => setValues((current) => ({ ...current, coverImagePath: value }))}
              value={values.coverImagePath ?? ''}
            />
            <ImagePathField
              help="Optional. Use this if you want a different social preview image."
              label="Open Graph image"
              onChange={(value) => setValues((current) => ({ ...current, ogImagePath: value }))}
              value={values.ogImagePath ?? ''}
            />
          </div>
        </AdminCard>

        <AdminCard>
          <AdminSectionHeading eyebrow="Optional" title="Search preview" />
          <div className="space-y-4">
            <AdminField label="Search title">
              <AdminInput
                onChange={(event) => setValues((current) => ({ ...current, seoTitle: event.target.value }))}
                placeholder="Optional. Leave blank to use the project title."
                value={values.seoTitle ?? ''}
              />
            </AdminField>
            <AdminField label="Search description">
              <AdminTextarea
                className="min-h-24"
                onChange={(event) =>
                  setValues((current) => ({ ...current, seoDescription: event.target.value }))
                }
                placeholder="Optional. Leave blank to use the excerpt."
                value={values.seoDescription ?? ''}
              />
            </AdminField>
          </div>
        </AdminCard>
      </div>
    </form>
  )
}
