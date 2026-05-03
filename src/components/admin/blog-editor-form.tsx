import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import {
  createBlogRequest,
  deleteBlogRequest,
  queryKeys,
  updateBlogRequest,
  uploadImageRequest,
} from '~/lib/admin-queries'
import type { BlogFormState } from '~/lib/api/types'
import { LexicalRichEditor } from '~/components/editor/lexical-rich-editor'
import { useUnsavedChangesWarning } from './use-unsaved-changes-warning'
import { ImagePathField } from './image-path-field'
import { listToString, stringToList } from './form-state'
import { AdminCard, AdminField, AdminInput, AdminSectionHeading, AdminSelect, AdminTextarea } from './primitives'

function normalizePublishedAt(value: string) {
  if (!value) {
    return ''
  }

  return value.includes('Z') ? value : new Date(value).toISOString()
}

export function BlogEditorForm({
  blogId,
  initialState,
}: Readonly<{
  blogId?: string
  initialState: BlogFormState
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
      const payload: BlogFormState = {
        ...values,
        status,
        publishedAt:
          status === 'published'
            ? normalizePublishedAt(values.publishedAt ?? '') || new Date().toISOString()
            : '',
      }

      return blogId ? updateBlogRequest(blogId, payload) : createBlogRequest(payload)
    },
    onSuccess: async (blog) => {
      toast.success(blog.status === 'published' ? 'Post published.' : 'Draft saved.')
      await queryClient.invalidateQueries({ queryKey: queryKeys.blogs })
      await queryClient.invalidateQueries({ queryKey: queryKeys.blog(blog.id) })
      const nextState = {
        title: blog.title,
        slug: blog.slug,
        excerpt: blog.excerpt,
        coverImagePath: blog.coverImagePath ?? '',
        seoTitle: blog.seoTitle ?? '',
        seoDescription: blog.seoDescription ?? '',
        ogImagePath: blog.ogImagePath ?? '',
        bodyJson: blog.bodyJson,
        bodyHtml: blog.bodyHtml,
        status: blog.status,
        publishedAt: blog.publishedAt ?? '',
        tags: blog.tags,
        readingTimeMinutes: blog.readingTimeMinutes,
      }
      setValues(nextState)
      setBaseline(JSON.stringify(nextState))

      if (!blogId) {
        await navigate({
          to: '/admin/blogs/$id/edit',
          params: { id: blog.id },
        })
      }
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to save blog post.')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!blogId) {
        return
      }

      return deleteBlogRequest(blogId)
    },
    onSuccess: async () => {
      toast.success('Post deleted.')
      await queryClient.invalidateQueries({ queryKey: queryKeys.blogs })
      await navigate({ to: '/admin/blogs' })
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to delete blog post.')
    },
  })

  return (
    <form
      className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_19.5rem]"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="space-y-6">
        <AdminCard>
          <AdminSectionHeading eyebrow="Step 1" title="Article details" />
          <div className="grid gap-4 md:grid-cols-2">
            <AdminField label="Title">
              <AdminInput
                onChange={(event) => setValues((current) => ({ ...current, title: event.target.value }))}
                placeholder="A title with signal"
                value={values.title}
              />
            </AdminField>
            <AdminField help="Leave blank to generate from the title." label="Slug">
              <AdminInput
                onChange={(event) => setValues((current) => ({ ...current, slug: event.target.value }))}
                placeholder="a-thoughtful-slug"
                value={values.slug ?? ''}
              />
            </AdminField>
          </div>
          <div className="mt-4 grid gap-4">
            <AdminField help="Short version for cards and metadata." label="Excerpt">
              <AdminTextarea
                onChange={(event) => setValues((current) => ({ ...current, excerpt: event.target.value }))}
                placeholder="Short supporting description."
                value={values.excerpt ?? ''}
              />
            </AdminField>
            <AdminField help="Comma-separated values." label="Tags">
              <AdminInput
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    tags: stringToList(event.target.value),
                  }))
                }
                placeholder="frontend, performance, product"
                value={listToString(values.tags)}
              />
            </AdminField>
          </div>
        </AdminCard>

        <AdminCard>
          <AdminSectionHeading eyebrow="Step 2" title="Write the article" />
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
            placeholder="Write the piece here..."
            valueHtml={values.bodyHtml}
            valueJson={values.bodyJson}
          />
        </AdminCard>
      </div>

      <div className="space-y-6 xl:sticky xl:top-24 xl:self-start">
        <AdminCard>
          <AdminSectionHeading eyebrow="Step 3" title="Save and publish" />
          <p className="mb-4 text-sm text-ink-soft">
            Keep writing in draft mode, then publish when the piece is ready for the public site.
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
            <AdminField help="Optional. Leave empty to use publish time." label="Published at">
              <AdminInput
                onChange={(event) => setValues((current) => ({ ...current, publishedAt: event.target.value }))}
                type="datetime-local"
                value={values.publishedAt ? values.publishedAt.slice(0, 16) : ''}
              />
            </AdminField>
            <AdminField help="Used if you want to override the computed value." label="Reading time (minutes)">
              <AdminInput
                min={1}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    readingTimeMinutes: Number(event.target.value) || 1,
                  }))
                }
                type="number"
                value={values.readingTimeMinutes}
              />
            </AdminField>
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
              {saveMutation.isPending && values.status === 'published' ? 'Publishing...' : 'Publish now'}
            </button>
          </div>
          {blogId ? (
            <button
              className="mt-4 inline-flex min-h-10 w-full items-center justify-center rounded-full border border-red-300 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={deleteMutation.isPending || saveMutation.isPending}
              onClick={() => {
                if (window.confirm('Delete this post? This cannot be undone.')) {
                  deleteMutation.mutate()
                }
              }}
              type="button"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete post'}
            </button>
          ) : null}
        </AdminCard>

        <AdminCard>
          <AdminSectionHeading eyebrow="Optional" title="Images" />
          <div className="space-y-4">
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
          <AdminSectionHeading eyebrow="Optional" title="SEO metadata" />
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
      </div>
    </form>
  )
}
