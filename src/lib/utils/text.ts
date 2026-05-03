export function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

export function computeReadingTimeMinutes(text: string) {
  const words = stripHtml(text).split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

export function buildExcerpt(text: string, maxLength = 180) {
  const plain = stripHtml(text)

  if (plain.length <= maxLength) {
    return plain
  }

  return `${plain.slice(0, maxLength).trimEnd()}...`
}
