import type { Metadata } from 'next'
import Link from 'next/link'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Privacy Policy | reWrite',
  description: 'How reWrite collects, uses, stores, and shares information.',
}

export const dynamic = 'force-static'

function inline(text: string): ReactNode[] {
  const nodes: ReactNode[] = []
  const pattern = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g
  let cursor = 0

  for (const match of text.matchAll(pattern)) {
    const index = match.index ?? 0
    if (index > cursor) nodes.push(text.slice(cursor, index))
    const token = match[0]
    if (token.startsWith('**')) {
      nodes.push(<strong key={index}>{token.slice(2, -2)}</strong>)
    } else {
      const parts = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
      if (parts) {
        const external = parts[2].startsWith('http')
        nodes.push(
          <a
            key={index}
            href={parts[2]}
            {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
          >
            {parts[1]}
          </a>,
        )
      }
    }
    cursor = index + token.length
  }
  if (cursor < text.length) nodes.push(text.slice(cursor))
  return nodes
}

function renderMarkdown(markdown: string) {
  const lines = markdown.replace(/\r/g, '').split('\n')
  const content: ReactNode[] = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index]
    if (!line.trim()) {
      index += 1
      continue
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/)
    if (heading) {
      const level = heading[1].length
      if (level > 1) {
        const Tag = level === 2 ? 'h2' : 'h3'
        content.push(<Tag key={index}>{inline(heading[2])}</Tag>)
      }
      index += 1
      continue
    }

    if (line.startsWith('|')) {
      const rows: string[][] = []
      while (index < lines.length && lines[index].startsWith('|')) {
        const cells = lines[index].split('|').slice(1, -1).map((cell) => cell.trim())
        if (!cells.every((cell) => /^-+$/.test(cell))) rows.push(cells)
        index += 1
      }
      content.push(
        <div className="policy-table-wrap" key={`table-${index}`}>
          <table>
            <thead><tr>{rows[0].map((cell) => <th key={cell}>{inline(cell)}</th>)}</tr></thead>
            <tbody>{rows.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{inline(cell)}</td>)}</tr>
            ))}</tbody>
          </table>
        </div>,
      )
      continue
    }

    if (line.startsWith('- ')) {
      const items: string[] = []
      while (index < lines.length && lines[index].startsWith('- ')) {
        items.push(lines[index].slice(2))
        index += 1
      }
      content.push(<ul key={`list-${index}`}>{items.map((item, itemIndex) => <li key={itemIndex}>{inline(item)}</li>)}</ul>)
      continue
    }

    const paragraph: string[] = []
    while (index < lines.length && lines[index].trim() && !/^(#{1,3})\s|^- |^\|/.test(lines[index])) {
      paragraph.push(lines[index].trim())
      index += 1
    }
    content.push(<p key={`p-${index}`}>{inline(paragraph.join(' '))}</p>)
  }

  return content
}

export default async function PrivacyPage() {
  const markdown = await readFile(
    path.join(process.cwd(), 'content', 'rewrite-privacy-policy.md'),
    'utf8',
  )

  return (
    <main className="policy-page">
      <header className="policy-nav">
        <div className="wrap">
          <Link className="policy-brand" href="/" aria-label="reWrite home">
            <b>re</b><i>Write</i>
          </Link>
          <Link className="policy-back" href="/">Back to home <span aria-hidden="true">↗</span></Link>
        </div>
      </header>

      <div className="policy-layout wrap">
        <aside className="policy-aside">
          <span className="kicker">Legal</span>
          <p>Privacy Policy</p>
          <div className="policy-dates">
            <span>Effective</span>14 July 2026
            <span>Last updated</span>14 July 2026
          </div>
        </aside>

        <article className="policy-article">
          <div className="policy-intro">
            <span className="kicker">Your data, clearly explained</span>
            <h1>Privacy <em>Policy</em></h1>
          </div>
          <div className="policy-copy">{renderMarkdown(markdown)}</div>
        </article>
      </div>
    </main>
  )
}
