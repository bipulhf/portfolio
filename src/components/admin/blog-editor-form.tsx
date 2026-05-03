import { Suspense, lazy, useEffect, useState } from 'react'
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
import { EditorPendingShell, ImageFieldPendingShell } from '~/components/loaders/crayon-pending'
import { useUnsavedChangesWarning } from './use-unsaved-changes-warning'
import { listToString, stringToList } from './form-state'
import { AdminCard, AdminField, AdminInput, AdminSectionHeading, AdminSelect, AdminTextarea } from './primitives'

const LexicalRichEditor = lazy(() =>
  import('~/components/editor/lexical-rich-editor').then((module) => ({
    default: module.LexicalRichEditor,
  })),
)

const ImagePathField = lazy(() =>
  import('./image-path-field').then((module) => ({
    default: module.ImagePathField,
  })),
)

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
      toast.success(blog.status === 'published' ? 'Post is live.' : 'Draft saved.')
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
      toast.error(error instanceof Error ? error.message : "We couldn't save this post.")
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
      toast.error(error instanceof Error ? error.message : "We couldn't delete this post.")
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
                placeholder="Article title"
                value={values.title}
              />
            </AdminField>
            <AdminField help="Leave this blank to generate it from the title." label="Slug">
              <AdminInput
                onChange={(event) => setValues((current) => ({ ...current, slug: event.target.value }))}
                placeholder="a-thoughtful-slug"
                value={values.slug ?? ''}
              />
            </AdminField>
          </div>
          <div className="mt-4 grid gap-4">
            <AdminField help="Shown on cards and in search previews." label="Excerpt">
              <AdminTextarea
                onChange={(event) => setValues((current) => ({ ...current, excerpt: event.target.value }))}
                placeholder="Short summary for cards and previews."
                value={values.excerpt ?? ''}
              />
            </AdminField>
            <AdminField help="Separate tags with commas." label="Tags">
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
          <Suspense fallback={<EditorPendingShell />}>
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
                toast.success('Image added to the article.')
                return upload.publicPath
              }}
              placeholder="Write the post here. Lead with the idea, then support it with examples."
              valueHtml={values.bodyHtml}
              valueJson={values.bodyJson}
            />
          </Suspense>
        </AdminCard>
      </div>

      <div className="space-y-6 xl:sticky xl:top-24 xl:self-start">
        <AdminCard>
          <AdminSectionHeading eyebrow="Step 3" title="Review and publish" />
          <p className="mb-4 text-sm text-ink-soft">
            Keep this in draft while you write. Publish when the piece is ready for readers.
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
            <AdminField help="Optional. Override the estimated reading time." label="Reading time (minutes)">
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
              {saveMutation.isPending && values.status === 'published' ? 'Publishing post...' : 'Publish post'}
            </button>
          </div>
          {blogId ? (
            <button
              className="mt-4 inline-flex min-h-10 w-full items-center justify-center rounded-full border border-red-300 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={deleteMutation.isPending || saveMutation.isPending}
              onClick={() => {
                if (window.confirm("Delete this post permanently? This can't be undone.")) {
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
            <Suspense fallback={<ImageFieldPendingShell />}>
              <ImagePathField
                help="Shown on post cards and at the top of the post page."
                label="Cover image"
                onChange={(value) => setValues((current) => ({ ...current, coverImagePath: value }))}
                value={values.coverImagePath ?? ''}
              />
            </Suspense>
            <Suspense fallback={<ImageFieldPendingShell />}>
              <ImagePathField
                help="Optional. Use this if you want a different social preview image."
                label="Open Graph image"
                onChange={(value) => setValues((current) => ({ ...current, ogImagePath: value }))}
                value={values.ogImagePath ?? ''}
              />
            </Suspense>
          </div>
        </AdminCard>

        <AdminCard>
          <AdminSectionHeading eyebrow="Optional" title="Search preview" />
          <div className="space-y-4">
            <AdminField label="Search title">
              <AdminInput
                onChange={(event) => setValues((current) => ({ ...current, seoTitle: event.target.value }))}
                placeholder="Optional. Leave blank to use the article title."
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
