import { useState, type FormEvent } from 'react'
import type { ContentItem, NewContentItem } from '../types/content'

interface ContentFormModalProps {
  initialValue?: ContentItem | null
  onClose: () => void
  onSubmit: (value: NewContentItem) => Promise<{ error: string | null }>
}

export default function ContentFormModal({
  initialValue,
  onClose,
  onSubmit,
}: ContentFormModalProps) {
  const [title, setTitle] = useState(initialValue?.title ?? '')
  const [body, setBody] = useState(initialValue?.body ?? '')
  const [isPublished, setIsPublished] = useState(
    initialValue?.is_published ?? false,
  )
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const isEditing = !!initialValue

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const { error: submitError } = await onSubmit({
      title: title.trim(),
      body: body.trim(),
      is_published: isPublished,
    })

    setSubmitting(false)

    if (submitError) {
      setError(submitError)
      return
    }

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          {isEditing ? 'Upravit položku' : 'Nová položka obsahu'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="content-title"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Název
            </label>
            <input
              id="content-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Např. Úvodní text na hlavní stránce"
              className="input-field"
            />
          </div>

          <div>
            <label
              htmlFor="content-body"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Obsah
            </label>
            <textarea
              id="content-body"
              required
              rows={5}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Text, který se zobrazí na webu…"
              className="input-field resize-none"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            Publikováno (viditelné veřejně)
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={submitting}
            >
              Zrušit
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Ukládám…' : isEditing ? 'Uložit změny' : 'Vytvořit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
