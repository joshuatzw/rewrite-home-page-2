import { notFound } from 'next/navigation'
import HtmlLangSync from '@/components/HtmlLangSync'
import { hasLocale, locales } from '@/dictionaries'

// Statically generate all three locales at build time. Defined once here so
// every page under this segment (home, /contact, /privacy, and eventually
// /pricing) is generated for en, th and zh without repeating the list.
export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  // The `lang` attribute here is what makes `:lang(th)` / `:lang(zh)` CSS work
  // during SSR. The <html> tag can't carry it (see HtmlLangSync), and without
  // a server-rendered lang attribute somewhere above the content, the
  // script-specific typography rules in globals.css would not apply until
  // after hydration — producing a visible flash of mis-styled text.
  return (
    <div lang={lang}>
      <HtmlLangSync lang={lang} />
      {children}
    </div>
  )
}
