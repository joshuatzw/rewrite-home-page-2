import Header from '@/components/Header'
import Hero from '@/components/Hero'
import HowItWorks from '@/components/HowItWorks'
import Statement from '@/components/Statement'
import Capabilities from '@/components/Capabilities'
import Skills from '@/components/Skills'
import TheLoop from '@/components/TheLoop'
import GetReWrite from '@/components/GetReWrite'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <section id="demo" className="wrap" style={{ marginTop: '8px' }}>
          <HowItWorks />
        </section>
        <Statement />
        <Capabilities />
        <Skills />
        <TheLoop />
        <GetReWrite />
        <Footer />
      </main>
    </>
  )
}
