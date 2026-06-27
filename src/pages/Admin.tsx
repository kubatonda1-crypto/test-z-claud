import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSiteContent } from '../hooks/useSiteContent'
import ContentFormModal from '../components/ContentFormModal'
import type { ContentItem } from '../types/content'

export default function Admin() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const { items, loading, error, createItem, updateItem, deleteItem } =
    useSiteContent()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const openCreateModal = () => {
    setEditingItem(null)
    setIsModalOpen(true)
  }

  const openEditModal = (item: ContentItem) => {
    setEditingItem(item)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      'Opravdu chceš tuto položku trvale smazat?',
    )
    if (!confirmed) return

    setDeletingId(id)
    await deleteItem(id)
    setDeletingId(null)
  }

  const handleTogglePublish = async (item: ContentItem) => {
    await updateItem(item.id, { is_published: !item.is_published })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Horní lišta administrace */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-brand-600">
              Administrace
            </p>
            <h1 className="text-xl font-bold text-slate-900">
              Správa obsahu webu
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-slate-500 sm:inline">
              Přihlášen jako <strong>{user?.email}</strong>
            </span>
            <button onClick={handleSignOut} className="btn-secondary">
              Odhlásit se
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* Souhrnné karty */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <SummaryCard label="Celkem položek" value={items.length} />
          <SummaryCard
            label="Publikováno"
            value={items.filter((i) => i.is_published).length}
          />
          <SummaryCard
            label="Koncepty"
            value={items.filter((i) => !i.is_published).length}
          />
        </div>

        {/* Hlavička sekce s tlačítkem pro vytvoření */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            Obsahové položky
          </h2>
          <button onClick={openCreateModal} className="btn-primary">
            + Nová položka
          </button>
        </div>

        {/* Stav: chyba */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Stav: načítání */}
        {loading && (
          <div className="card text-center text-sm text-slate-500">
            Načítám obsah…
          </div>
        )}

        {/* Stav: prázdno */}
        {!loading && items.length === 0 && !error && (
          <div className="card text-center text-sm text-slate-500">
            Zatím žádný obsah. Vytvoř první položku tlačítkem výše.
          </div>
        )}

        {/* Tabulka obsahu */}
        {!loading && items.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Název</th>
                  <th className="px-4 py-3">Stav</th>
                  <th className="px-4 py-3">Aktualizováno</th>
                  <th className="px-4 py-3 text-right">Akce</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">
                        {item.title}
                      </p>
                      <p className="max-w-md truncate text-slate-500">
                        {item.body}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleTogglePublish(item)}
                        className={
                          item.is_published
                            ? 'rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700'
                            : 'rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600'
                        }
                        title="Kliknutím změníš stav publikování"
                      >
                        {item.is_published ? 'Publikováno' : 'Koncept'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {new Date(item.updated_at).toLocaleString('cs-CZ')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="rounded-md px-2 py-1 text-brand-600 hover:bg-brand-50"
                        >
                          Upravit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="rounded-md px-2 py-1 text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          {deletingId === item.id ? 'Mažu…' : 'Smazat'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {isModalOpen && (
        <ContentFormModal
          initialValue={editingItem}
          onClose={() => setIsModalOpen(false)}
          onSubmit={(value) =>
            editingItem ? updateItem(editingItem.id, value) : createItem(value)
          }
        />
      )}
    </div>
  )
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="card">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  )
}
