import { Icon } from '../icons'
import { ArticleCard, useMagazine } from '../magazine'
import { usePageTitle } from '../usePageTitle'
import { useSiteUi } from '../components/SiteFrame'

export default function ArticlesPage() {
  usePageTitle('مجلهٔ رژیم من | رژیم من')
  const query = useMagazine()
  const { toast } = useSiteUi()
  return (
    <>
      <section className="subhero wrap">
        <div className="eyebrow">مجلهٔ رژیم من</div>
        <h1>سه نوشته دربارهٔ رژیم من</h1>
      </section>
      <section className="wrap articles-list">
        <div className="magazine-grid" id="article-grid">
          {query.isLoading ? <p>در حال بارگذاری مقاله‌ها…</p> : null}
          {query.isError ? <p>دریافت مقالات ممکن نشد.</p> : null}
          {query.data?.length === 0 ? <p>مقاله‌ای برای نمایش وجود ندارد.</p> : null}
          {query.data?.map((item) => <ArticleCard key={item.id} item={item} />)}
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
