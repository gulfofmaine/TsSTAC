import { ICatalog, ICatalogData, ICollection, ISTAC } from './types'
import { Link } from './link'
import { CatalogCollectionCommon } from './collection_catalog_common'

export class Catalog extends CatalogCollectionCommon implements ICatalog {
  type = 'Catalog' as const
  stac_version: string
  stac_extensions: string[]
  id: string
  title?: string | undefined
  description: string
  links: Link[]
  extra_fields?: { [key: string]: any }

  store?: ISTAC
  self_href?: string
  parent?: ICatalog | ICollection
  root?: ICatalog

  constructor(
    catalog_obj: ICatalogData & {
      store?: ISTAC
      self_href?: string
      root?: ICatalog
      parent?: ICatalog | ICollection
    } & object
  ) {
    super()

    const {
      stac_version,
      stac_extensions,
      id,
      title,
      description,
      links,
      store,
      self_href,
      root,
      parent,
      ...extra
    } = catalog_obj

    this.stac_version = stac_version
    this.stac_extensions = stac_extensions ?? []
    this.id = id
    this.title = title
    this.description = description
    this.links = links.map(l => new Link(l))
    this.store = store
    this.self_href = self_href
    this.root = root
    this.parent = parent
    this.extra_fields = extra
  }

  async describe(depth: number, spaces: string = ''): Promise<string> {
    let result = `${spaces}* <Catalog ${this.id}>`

    if (depth !== 0) {
      const children = await this.get_children()
      for (const child of children) {
        result += '\n' + (await child.describe(depth - 1, spaces + '  '))
      }
    }

    return result
  }
}
