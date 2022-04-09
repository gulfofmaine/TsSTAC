import {
  ICatalog,
  ICollection,
  ISTAC,
  ICollectionData,
  IAssetData,
} from './types'
import { CatalogCollectionCommon } from './collection_catalog_common'
import { Link } from './link'

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
  assets: { [key: string]: IAssetData }
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
    this.links = links.map(l => new Link(l))
    this.store = store
    this.self_href = self_href
    this.keywords = keywords ?? []
    this.license = license
    this.providers = providers
    this.extent = extent
    this.summaries = summaries ?? {}
    this.assets = assets ?? {}
    this.extra_fields = extra
    this.root = root
    this.parent = parent
  }
}
