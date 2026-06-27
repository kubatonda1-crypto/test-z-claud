export interface ContentItem {
  id: string
  title: string
  body: string
  is_published: boolean
  created_at: string
  updated_at: string
}

// Tvar dat potřebný pro vytvoření nové položky (id/created_at/updated_at
// generuje databáze automaticky).
export type NewContentItem = Pick<ContentItem, 'title' | 'body' | 'is_published'>
