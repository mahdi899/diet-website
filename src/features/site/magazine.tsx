import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import type { ReactNode } from 'react'

export interface ArticleSection {
  heading: string
  body: string
}

export interface ArticleItem {
  id: string
  title: string
  category: string
  image: number
  time?: number | string
  intro: string
  sections?: ArticleSection[]
}

const photos = ['salad.jpg', 'vegetables.jpg', 'breakfast.jpg', 'bowl.jpg']
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function isArticleSlug(slug: string) {
  return slugPattern.test(slug)
}

export function articlePhoto(index: number) {
  return '/assets/' + (photos[index] ?? photos[0])
}

export async function loadMagazine(): Promise<ArticleItem[]> {
  try {
    const response = await fetch('/v1/public/articles')
    if (response.ok) {
      const body = (await response.json()) as { items?: ArticleItem[] }
      if (body.items?.length) return body.items
    }
  } catch {
    // magazine.json is the site content when the API is offline.
  }
  const response = await fetch('/magazine.json')
  if (!response.ok) throw new Error('دریافت مقالات ممکن نشد.')
  const body = (await response.json()) as { items?: ArticleItem[] }
  return body.items ?? []
}

export function useMagazine() {
  return useQuery({ queryKey: ['magazine'], queryFn: loadMagazine, staleTime: 60_000 })
}

export async function loadArticle(slug: string): Promise<ArticleItem> {
  const items = await loadMagazine()
  const found = items.find((item) => item.id === slug)
  if (found?.sections?.length) return found
  try {
    const response = await fetch('/v1/public/articles/' + encodeURIComponent(slug))
    if (response.ok) return (await response.json()) as ArticleItem
  } catch {
    // The local magazine still has the full article.
  }
  if (found) return found
  throw new Error('مقاله پیدا نشد.')
}

export function emphasize(text: string): ReactNode[] {
  return text.split(/«([^»]+)»/).map((part, index) => (
    index % 2 === 1 ? <strong key={index}>«{part}»</strong> : part
  ))
}

export function ArticleParagraphs({ text, className = 'article-para' }: { text: string; className?: string }) {
  const paragraphs = text.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean)
  return paragraphs.map((paragraph, index) => (
    <p key={index} className={className}>{emphasize(paragraph)}</p>
  ))
}

export function ArticleCard({ item, showIntro = true }: { item: ArticleItem; showIntro?: boolean }) {
  return (
    <Link className="article-card" to={'/article?id=' + encodeURIComponent(item.id)}>
      <div className="photo">
        <img loading="lazy" src={articlePhoto(item.image)} alt="" />
      </div>
      <div className="article-card-copy">
        <span className="tag">{item.category}</span>
        <h3>{item.title}</h3>
        {showIntro ? <p className="article-card-excerpt">{String(item.intro || '').split('\n')[0]}</p> : null}
      </div>
    </Link>
  )
}
