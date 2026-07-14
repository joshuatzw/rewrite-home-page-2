import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Contact us | reWrite',
  description: 'Get in touch with the reWrite team.',
}

export default function ContactPage() {
  return (
    <>
      <header className="top legal-top">
        <div className="wrap">
          <Link className="brand" href="/" aria-label="reWrite home">
            <Image src="/assets/logo_transparent_new.png" alt="" width={26} height={26} />
            <span className="name">
              <b>re</b>
              <i>Write</i>
            </span>
          </Link>
          <Link className="legal-back" href="/">
            Back to home
          </Link>
        </div>
      </header>

      <main className="contact-page">
        <div className="wrap contact-wrap">
          <div className="contact-intro">
            <p className="kicker">Contact us</p>
            <h1>How can we <em>help?</em></h1>
            <p>
              Questions, feedback, or something not working as expected? Send us a note and
              we&apos;ll get back to you as soon as we can.
            </p>
          </div>

          <form
            className="contact-form"
            action="mailto:hello@rewriteai.dev"
            method="post"
            encType="text/plain"
          >
            <div className="contact-field-grid">
              <div className="contact-field">
                <label htmlFor="name">Name</label>
                <input id="name" name="Name" type="text" autoComplete="name" required />
              </div>
              <div className="contact-field">
                <label htmlFor="email">Email</label>
                <input id="email" name="Email" type="email" autoComplete="email" required />
              </div>
            </div>

            <div className="contact-field">
              <label htmlFor="query-type">Query type</label>
              <select id="query-type" name="Query type" defaultValue="General" required>
                <option>General</option>
                <option>Feedback</option>
                <option>Payment and billing</option>
                <option>Others</option>
              </select>
            </div>

            <div className="contact-field">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="Message" rows={7} required />
            </div>

            <button className="contact-submit" type="submit">
              Send message
            </button>
          </form>

          <aside className="contact-email" aria-label="Email contact option">
            <p className="kicker">Prefer email?</p>
            <p>
              You can also write to us directly at{' '}
              <a href="mailto:hello@rewriteai.dev">hello@rewriteai.dev</a>.
            </p>
          </aside>
        </div>
      </main>
    </>
  )
}
