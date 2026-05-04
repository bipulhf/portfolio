import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './api/client'
import type { SessionPayload } from './api/types'
import type { SerializedBlog, SerializedProject } from './content/types'
import { uploadAdminImage } from './uploadthing/client'
import type { BlogInput, ProjectInput } from './validation/content'

export const queryKeys = {
  session: ['auth.session'] as const,
  projects: ['admin.projects.list'] as const,
  project: (id: string) => ['admin.projects.detail', id] as const,
  blogs: ['admin.blogs.list'] as const,
  blog: (id: string) => ['admin.blogs.detail', id] as const,
}

export async function fetchSession() {
  return api.get('auth/session').json<SessionPayload>()
}

export async function loginRequest(payload: { email: string; password: string }) {
  return api.post('auth/login', { json: payload }).json<{ ok: true }>()
}

export async function logoutRequest() {
  return api.post('auth/logout').json<{ ok: true }>()
}

export async function listProjectsRequest() {
  return api.get('admin/projects').json<SerializedProject[]>()
}

export async function getProjectRequest(id: string) {
  return api.get(`admin/projects/${id}`).json<SerializedProject>()
}

export async function createProjectRequest(payload: ProjectInput) {
  return api.post('admin/projects', { json: payload }).json<SerializedProject>()
}

export async function updateProjectRequest(id: string, payload: ProjectInput) {
  return api.patch(`admin/projects/${id}`, { json: payload }).json<SerializedProject>()
}

export async function deleteProjectRequest(id: string) {
  return api.delete(`admin/projects/${id}`).json<{ ok: true }>()
}

export async function listBlogsRequest() {
  return api.get('admin/blogs').json<SerializedBlog[]>()
}

export async function getBlogRequest(id: string) {
  return api.get(`admin/blogs/${id}`).json<SerializedBlog>()
}

export async function createBlogRequest(payload: BlogInput) {
  return api.post('admin/blogs', { json: payload }).json<SerializedBlog>()
}

export async function updateBlogRequest(id: string, payload: BlogInput) {
  return api.patch(`admin/blogs/${id}`, { json: payload }).json<SerializedBlog>()
}

export async function deleteBlogRequest(id: string) {
  return api.delete(`admin/blogs/${id}`).json<{ ok: true }>()
}

export async function uploadImageRequest(
  file: File,
  options: {
    onUploadProgress?: (progress: number) => void
  } = {},
) {
  const upload = await uploadAdminImage(file, options)

  return {
    fileKey: upload.fileKey,
    publicPath: upload.publicPath,
  }
}

export function useAdminSession() {
  return useQuery({
    queryKey: queryKeys.session,
    queryFn: fetchSession,
  })
}

export function useLogoutMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logoutRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.session })
    },
  })
}
