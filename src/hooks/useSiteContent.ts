import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { ContentItem, NewContentItem } from '../types/content'

interface UseSiteContentResult {
  items: ContentItem[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  createItem: (item: NewContentItem) => Promise<{ error: string | null }>
  updateItem: (
    id: string,
    item: Partial<NewContentItem>,
  ) => Promise<{ error: string | null }>
  deleteItem: (id: string) => Promise<{ error: string | null }>
}

/**
 * Zapouzdřuje veškerou komunikaci s tabulkou `site_content` v Supabase.
 * Komponenty se tak nemusí starat o detaily volání API.
 */
export function useSiteContent(): UseSiteContentResult {
  const [items, setItems] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)

    const { data, error: fetchError } = await supabase
      .from('site_content')
      .select('*')
      .order('created_at', { ascending: false })

    if (fetchError) {
      setError('Nepodařilo se načíst obsah: ' + fetchError.message)
      setItems([])
    } else {
      setItems(data ?? [])
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const createItem: UseSiteContentResult['createItem'] = async (item) => {
    const { error: insertError } = await supabase
      .from('site_content')
      .insert(item)

    if (insertError) {
      return { error: 'Nepodařilo se vytvořit položku: ' + insertError.message }
    }

    await refresh()
    return { error: null }
  }

  const updateItem: UseSiteContentResult['updateItem'] = async (id, item) => {
    const { error: updateError } = await supabase
      .from('site_content')
      .update(item)
      .eq('id', id)

    if (updateError) {
      return { error: 'Nepodařilo se uložit změny: ' + updateError.message }
    }

    await refresh()
    return { error: null }
  }

  const deleteItem: UseSiteContentResult['deleteItem'] = async (id) => {
    const { error: deleteError } = await supabase
      .from('site_content')
      .delete()
      .eq('id', id)

    if (deleteError) {
      return { error: 'Nepodařilo se smazat položku: ' + deleteError.message }
    }

    await refresh()
    return { error: null }
  }

  return { items, loading, error, refresh, createItem, updateItem, deleteItem }
}
