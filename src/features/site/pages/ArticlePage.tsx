import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Icon } from '../icons'
import { ArticleCard, ArticleParagraphs, articlePhoto, isArticleSlug, loadArticle, useMagazine } from '../magazine'
import { usePageTitle } from '../usePageTitle'
import { useSiteUi } from '../components/SiteFrame'

export default function ArticlePage() {
  const [params] = useSearchParams()
  const slug = params.get('id') ?? ''
  const validSlug = isArticleSlug(slug)
  const magazine = useMagazine()
  const query = useQuery({
    queryKey: ['article', slug],
    enabled: validSlug,
    queryFn: () => loadArticle(slug),
    staleTime: 60_000,
  })
  const article = query.data
  const { toast } = useSiteUi()
  const [progress, setProgress] = useState(0)
  usePageTitle(article ? article.title + ' | مجلهٔ رژیم من' : 'جزئیات مقاله | رژیم من')

  useEffect(() => {
    const content = document.querySelector('#article-content')
    if (!content) return
    const update = () => {
      const box = content.getBoundingClientRect()
      const value = Math.min(1, Math.max(0, (100 - box.top) / Math.max(1, box.height - window.innerHeight / 2)))
      setProgress(value)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [article?.id])

  if (!validSlug || query.isError) {
    return <p className="wrap" style={{ padding: '48px 0' }}>مقاله پیدا نشد. <Link to="/articles">بازگشت</Link></p>
  }
  if (query.isLoading || !article) return <p className="wrap" style={{ padding: '48px 0' }}>در حال بارگذاری…</p>

  const related = (magazine.data ?? []).filter((item) => item.id !== article.id)
  return (
    <>
      <div className="reading-progress" aria-hidden="true" style={{ width: progress * 100 + '%' }} />
      <div className="wrap">
        <header className="article-heading">
          <span className="tag" id="article-category">{article.category}</span>
          <h1 id="article-title">{article.title}</h1>
          <div id="article-intro" className="article-intro-text">
            <ArticleParagraphs text={article.intro} />
          </div>
          <div className="meta">
            <span>تحریریهٔ رژیم من</span>
            <span>۱۹ آبان ۱۴۰۵</span>
            <span id="article-time">{article.time} دقیقه مطالعه</span>
          </div>
        </header>
        <div className="cover"><img id="article-cover" src={articlePhoto(article.image)} alt="مواد غذایی تازه و متنوع" /></div>
        <div className="reading-layout">
          <aside className="toc">
            <h3>در این مقاله می‌خوانی</h3>
            <div id="toc-links">
              {article.sections?.map((section, index) => (
                <a key={section.heading} href={'#part-' + index}>{section.heading}</a>
              ))}
            </div>
            <Link to="/articles" style={{ borderTop: '1px solid #dce4d2', marginTop: 12, paddingTop: 12 }}>← بازگشت به مقاله‌ها</Link>
          </aside>
          <article className="article-body">
            <div id="article-content">
              {article.sections?.map((section, index) => (
                <div key={section.heading}>
                  <h2 id={'part-' + index}>{section.heading}</h2>
                  <div className="article-section-text"><ArticleParagraphs text={section.body} /></div>
                </div>
              ))}
            </div>
            <div className="author">
              <span className="iconbox"><Icon name="leaf" /></span>
              <div><b>تحریریهٔ رژیم من</b><small>دربارهٔ غذا و زندگی روزمره</small></div>
              <button
                className="share"
                id="share"
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(location.href).then(
                    () => toast('لینک مقاله کپی شد'),
                    () => toast('آدرس مقاله را از نوار مرورگر کپی کن.'),
                  )
                }}
              >
                کپی لینک مقاله
              </button>
            </div>
          </article>
        </div>
      </div>
      <section className="wrap" style={{ paddingBottom: 65 }}>
        <div className="section-title">
          <h2>ادامهٔ این مسیر خواندنی</h2>
          <Link className="textlink" to="/articles">همهٔ مقاله‌ها <Icon name="arrow" /></Link>
        </div>
        <div className="magazine-grid" id="related-posts">
          {related.map((item) => <ArticleCard key={item.id} item={item} />)}
        </div>
      </section>
      <div className="cta wrap">
        <div>
          <h2>از یک انتخاب خوب شروع کن.</h2>
          <p>یک برنامهٔ غذایی، متناسب با سلیقه و زندگی تو.</p>
        </div>
        <button className="btn" type="button" onClick={() => toast('نسخهٔ قابل دانلود به‌زودی منتشر می‌شود.')}>
          دانلود اپلیکیشن <Icon name="arrow" />
        </button>
      </div>
    </>
  )
}
