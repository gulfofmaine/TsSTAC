export function isAbsoluteUrl(url: string): boolean {
  return url.includes('://')
}

export function isRelativeUrl(url: string): boolean {
  return url.startsWith('./') || url.startsWith('../') || url.startsWith('/')
}
