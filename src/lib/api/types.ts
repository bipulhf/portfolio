import type { BlogInput, ProjectInput } from '~/lib/validation/content'

export type SessionPayload = {
  adminId: string
  email: string
} | null

export type ApiErrorPayload = {
  message: string
}

export type ContentFormState<TValues> = TValues & {
  bodyJson: Record<string, unknown> | null
  bodyHtml: string
}

export type ProjectFormState = ContentFormState<ProjectInput>
export type BlogFormState = ContentFormState<BlogInput>
