import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { uploadImageRequest } from '~/lib/admin-queries'
import { AdminField, AdminInput } from './primitives'

export function ImagePathField({
  help,
  label,
  onChange,
  value,
}: Readonly<{
  help?: string
  label: string
  onChange: (value: string) => void
  value: string
}>) {
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      setUploadProgress(0)

      try {
        return await uploadImageRequest(file, {
          onUploadProgress: setUploadProgress,
        })
      } finally {
        setUploadProgress(null)
      }
    },
    onSuccess: (response) => {
      onChange(response.publicPath)
      toast.success('Image uploaded.')
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "We couldn't upload that image.")
    },
  })

  return (
    <AdminField help={help} label={label}>
      <div className="flex flex-col gap-3">
        <AdminInput
          onChange={(event) => onChange(event.target.value)}
          placeholder="https://your-app.ufs.sh/f/example-file-key"
          value={value}
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <label className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center rounded-[0.95rem] border-2 border-dashed border-ink bg-white/65 px-4 py-2 text-center font-hand text-lg text-ink transition-colors hover:bg-mint/45 sm:w-auto">
            <input
              accept="image/*"
              className="hidden"
              disabled={uploadMutation.isPending}
              onChange={(event) => {
                const file = event.target.files?.[0]
                event.currentTarget.value = ''

                if (file) {
                  uploadMutation.mutate(file)
                }
              }}
              type="file"
            />
            {uploadMutation.isPending
              ? `Uploading${typeof uploadProgress === 'number' ? ` ${Math.round(uploadProgress)}%` : '...'}`
              : 'Upload from computer'}
          </label>
          {value ? (
            <a
              className="inline-flex min-h-11 items-center font-hand text-lg text-ink-soft transition-colors hover:text-ink"
              href={value}
              rel="noreferrer"
              target="_blank"
            >
              Preview image ↗
            </a>
          ) : null}
        </div>
        {typeof uploadProgress === 'number' ? (
          <div className="space-y-2">
            <div className="h-2 overflow-hidden rounded-full bg-paper-shadow/60">
              <div
                className="h-full rounded-full bg-mint transition-[width] duration-200"
                style={{ width: `${Math.min(Math.max(uploadProgress, 0), 100)}%` }}
              />
            </div>
            <p className="text-sm text-ink-soft">Uploading to your media library...</p>
          </div>
        ) : null}
        {value ? (
          <div className="overflow-hidden rounded-[1rem] border-2 border-ink bg-paper-shadow/35 p-2">
            <img alt={label} className="max-h-48 w-full rounded-[0.8rem] object-cover" src={value} />
          </div>
        ) : null}
      </div>
    </AdminField>
  )
}
