import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Pricing from '@/components/Pricing'
import Footer from '@/components/Footer'
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
  return { title: dict.meta.pricing.title, description: dict.meta.pricing.description, alternates: alternatesFor("/pricing", lang) }
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const dict = await getDictionary(lang)

  return (
    <>
      <Header lang={lang} nav={dict.nav} languageToggle={dict.languageToggle} />
      <main>
        <Pricing dict={dict.pricing} ctaHref={`/${lang}#get`} />
        <Footer lang={lang} dict={dict.footer} />
      </main>
    </>
  )
}
