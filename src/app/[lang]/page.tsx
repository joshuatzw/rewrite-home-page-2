import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import HowItWorks from '@/components/HowItWorks'
import Statement from '@/components/Statement'
import Capabilities from '@/components/Capabilities'
import Skills from '@/components/Skills'
import TheLoop from '@/components/TheLoop'
import GetReWrite from '@/components/GetReWrite'
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
  return { title: dict.meta.home.title, description: dict.meta.home.description, alternates: alternatesFor("", lang) }
}

export default async function Home({
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
        <Hero dict={dict.hero} />
        <section id="demo" className="wrap" style={{ marginTop: '8px' }}>
          <HowItWorks dict={dict.howItWorks} lang={lang} />
        </section>
        <Statement dict={dict.statement} />
        <Capabilities dict={dict.capabilities} />
        <Skills dict={dict.skills} skillsAppDict={dict.skillsApp} />
        <TheLoop dict={dict.theLoop} />
        <GetReWrite dict={dict.getReWrite} />
        <Footer lang={lang} dict={dict.footer} />
      </main>
    </>
  )
}
