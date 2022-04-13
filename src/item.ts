import { Asset } from './asset'
import { Link } from './link'
import { STACObject } from './stac_object'
import { IItem, IItemData, ISTAC, ICatalog, ICollection } from './types'

export class Item extends STACObject implements IItem {
  type = 'Feature' as const
  stac_version: string
  stac_extensions: string[]
  title?: string | undefined
  description?: string | undefined
  id: string
  links: Link[]
  geometry?: {
    type: string
    coordinates: number[][]
  }
  assets: { [key: string]: Asset }
  bbox?: number[] | undefined
  collection?: string | undefined

  extra_fields?: { [key: string]: any }

  store?: ISTAC | undefined
  self_href?: string | undefined
  parent?: ICatalog | ICollection | undefined
  root?: ICatalog | undefined

  constructor(
    item_obj: IItemData & {
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
      title,
      description,
      id,
      links,
      geometry,
      assets,
      bbox,
      collection,
      store,
      self_href,
      parent,
      root,

      ...extra
    } = item_obj

    this.stac_version = stac_version
    this.stac_extensions = stac_extensions ?? []
    this.title = title
    this.description = description
    this.id = id
    this.links = links.map(l => new Link(l))
    this.geometry = geometry
    this.assets = {}

    Object.entries(assets).forEach(([key, value]) => {
      this.assets[key] = new Asset(value)
    })

    this.bbox = bbox
    this.collection = collection
    this.store = store
    this.self_href = self_href
    this.parent = parent
    this.root = root
    this.extra_fields = extra
  }

  describe = async (_: number = 0, spaces: string = '') => {
    return `${spaces}* <Item ${this.id}>`
  }

  //   get_collection(): Promise<ICollection | ICatalog> {
  //       if (this.parent) {
  //           return this.parent
  //       }

  //       if (this.collection && this.store && this.root) {

  //       }
  //   }
}
