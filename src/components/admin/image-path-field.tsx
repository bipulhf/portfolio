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
  const uploadMutation = useMutation({
    mutationFn: uploadImageRequest,
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
          placeholder="/media/example-image.png"
          value={value}
        />
        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex cursor-pointer items-center justify-center rounded-[0.95rem] border-2 border-dashed border-ink bg-white/65 px-4 py-2 font-hand text-lg text-ink transition-colors hover:bg-mint/45">
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
            {uploadMutation.isPending ? 'Uploading...' : 'Upload from computer'}
          </label>
          {value ? (
            <a
              className="font-hand text-lg text-ink-soft transition-colors hover:text-ink"
              href={value}
              rel="noreferrer"
              target="_blank"
            >
              Preview image ↗
            </a>
          ) : null}
        </div>
        {value ? (
          <div className="overflow-hidden rounded-[1rem] border-2 border-ink bg-paper-shadow/35 p-2">
            <img alt={label} className="max-h-48 w-full rounded-[0.8rem] object-cover" src={value} />
          </div>
        ) : null}
      </div>
    </AdminField>
  )
}
