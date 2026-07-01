import Image from 'next/image'

export default function Header() {
  return (
    <header className="top">
      <div className="wrap">
        <div className="brand">
          <Image src="/assets/reWrite-logo.png" alt="reWrite" width={26} height={26} />
          <span className="name">
            <b>re</b>
            <i>Write</i>
          </span>
        </div>
        <nav className="links">
          <a href="#demo">Demo</a>
          <a href="#caps">What it does</a>
          <a href="#loop">The loop</a>
          <a href="#" className="btn-ghost">
            Get reWrite
          </a>
        </nav>
      </div>
    </header>
  )
}
