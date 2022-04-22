import { ICatalog, ICollection, ISTAC, ICollectionData } from './types'
import { CatalogCollectionCommon } from './collection_catalog_common'
import { Link } from './link'
import { Asset } from './asset'

export class Collection extends CatalogCollectionCommon implements ICollection {
  type = 'Collection' as const
  stac_version: string
  stac_extensions: string[]
  id: string
  title?: string | undefined
  description: string
  links: Link[]
  keywords: string[]
  license: string
  providers: object[]
  extent: object
  summaries: { [key: string]: object }
  assets: { [key: string]: Asset }
  extra_fields?: { [key: string]: any }

  store?: ISTAC | undefined
  self_href?: string | undefined
  parent?: ICatalog | ICollection
  root?: ICatalog

  constructor(
    collection_obj: ICollectionData & {
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
      keywords,
      license,
      providers,
      extent,
      summaries,
      assets,
      root,
      parent,
      ...extra
    } = collection_obj

    this.stac_version = stac_version
    this.stac_extensions = stac_extensions ?? []
    this.id = id
    this.title = title
    this.description = description
    this.links = links.map((l) => new Link(l))
    this.store = store
    this.self_href = self_href
    this.keywords = keywords ?? []
    this.license = license
    this.providers = providers
    this.extent = extent
    this.summaries = summaries ?? {}
    this.assets = {}

    Object.entries(assets ?? {}).forEach(([key, value]) => {
      this.assets[key] = new Asset(value)
    })

    this.extra_fields = extra
    this.root = root
    this.parent = parent
  }

  async describe(depth: number, spaces: string = ''): Promise<string> {
    let result = `${spaces}* <Collection ${this.id}>`

    if (depth !== 0) {
      const children = await this.get_children()
      for (const child of children) {
        result += '\n' + (await child.describe(depth - 1, spaces + '  '))
      }

      const items = await this.get_items()
      for (const item of items) {
        result += '\n' + (await item.describe(depth - 1, spaces + ' '))
      }
    }

    return result
  }
}
