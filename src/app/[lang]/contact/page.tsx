import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale } from '@/dictionaries'
import { alternatesFor } from '@/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const dict = await getDictionary(lang)
  return { title: dict.meta.contact.title, description: dict.meta.contact.description, alternates: alternatesFor("/contact", lang) }
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const dict = await getDictionary(lang)
  const c = dict.contact

  return (
    <>
      <header className="top legal-top">
        <div className="wrap">
          <Link className="brand" href={`/${lang}`} aria-label="reWrite home">
            <Image src="/assets/logo_transparent_new.png" alt="" width={26} height={26} />
            <span className="name">
              <b>re</b>
              <i>Write</i>
            </span>
          </Link>
          <Link className="legal-back" href={`/${lang}`}>
            {dict.nav.backToHome}
          </Link>
        </div>
      </header>

      <main className="contact-page">
        <div className="wrap contact-wrap">
          <div className="contact-intro">
            <p className="kicker">{c.kicker}</p>
            <h1>{c.headingBefore}<em>{c.headingEm}</em></h1>
            <p>{c.intro}</p>
          </div>

          <form
            className="contact-form"
            action="mailto:hello@rewriteai.dev"
            method="post"
            encType="text/plain"
          >
            <div className="contact-field-grid">
              <div className="contact-field">
                <label htmlFor="name">{c.form.name}</label>
                <input id="name" name="Name" type="text" autoComplete="name" required />
              </div>
              <div className="contact-field">
                <label htmlFor="email">{c.form.email}</label>
                <input id="email" name="Email" type="email" autoComplete="email" required />
              </div>
            </div>

            <div className="contact-field">
              <label htmlFor="query-type">{c.form.queryType}</label>
              <select id="query-type" name="Query type" defaultValue={c.form.queryOptions[0]} required>
                {c.form.queryOptions.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="contact-field">
              <label htmlFor="message">{c.form.message}</label>
              <textarea id="message" name="Message" rows={7} required />
            </div>

            <button className="contact-submit" type="submit">
              {c.form.submit}
            </button>
          </form>

          <aside className="contact-email" aria-label="Email contact option">
            <p className="kicker">{c.emailKicker}</p>
            <p>
              {c.emailIntroBefore}
              <a href="mailto:hello@rewriteai.dev">hello@rewriteai.dev</a>
              {c.emailIntroAfter}
            </p>
          </aside>
        </div>
      </main>
    </>
  )
}
