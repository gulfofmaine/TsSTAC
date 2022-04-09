import { isAbsoluteUrl, isRelativeUrl } from './absolute_url'
import { ICatalog, ICollection, ISTAC, ISTACObject } from './types'
import { Link } from './link'

export abstract class STACObject implements ISTACObject {
  abstract links: Link[]
  abstract type: string
  abstract stac_extensions?: string[] | undefined
  abstract id: string
  abstract stac_version: string
  abstract store?: ISTAC | undefined
  abstract self_href?: string | undefined
  abstract root?: ICatalog | undefined
  abstract parent?: ICollection | ICatalog | undefined

  /**
   * Filter links for catalog and collections
   * @returns Children Catalog and Collection links
   */
  get_child_links(): Link[] {
    return this.links.filter(l => l.rel === 'child')
  }

  /**
   * Filter links to items
   * @returns Children Item links
   */
  get_item_links(): Link[] {
    return this.links.filter(l => l.rel === 'item')
  }

  /**
   * Returns the absolute URL for a child link, even if it is relative
   * @param link A child link
   * @returns
   */
  url_for_link(link: Link) {
    if (isAbsoluteUrl(link.href)) {
      return link.href
    }

    let href = link.href

    if (!isRelativeUrl(href)) {
      href = `./${href}`
    }

    return new URL(href, this.self_href).href
  }

  abstract describe(depth: number, spaces: string): Promise<string>
}
