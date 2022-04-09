import { ILink } from './types'

export class Link implements ILink {
  href: string
  rel: string
  media_type?: string
  extra_fields?: { [key: string]: any }

  constructor(obj: ILink & object) {
    const { href, rel, media_type, ...rest } = obj
    this.href = href
    this.rel = rel
    this.media_type = media_type
    this.extra_fields = rest
  }
}
