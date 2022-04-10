import {
  ICatalog,
  ICatalogCollection,
  ICatalogData,
  ICollectionData,
  IFetchFn,
  IItemData,
  ISTAC,
  IStoreChild,
  IStoreChilden,
} from './types'

import { Catalog } from './catalog'
import { Collection } from './collection'
import { Item } from './item'

export class STAC implements ISTAC {
  private children: IStoreChilden = {}

  constructor(public fetcher: IFetchFn) {}

  /**
   * Load a STAC catalog, collection, or item from a given URL or path
   *
   * @param url
   * @returns
   */
  async load(
    url: string,
    rel?: {
      parent?: ICatalogCollection
      root?: ICatalog
    }
  ): Promise<IStoreChild> {
    const result = await this.fetcher(url)
    let data: IStoreChild

    if ('geometry' in result) {
      data = new Item(result as IItemData)
    } else if ('license' in result) {
      data = new Collection(result as ICollectionData)
    } else {
      data = new Catalog(result as ICatalogData)
    }

    data.store = this
    data.self_href = url

    if (rel?.parent) {
      data.parent = rel.parent
    }
    if (rel?.root) {
      data.root = rel.root
    }

    this.children[url] = data

    return data
  }

  /**
   *
   * @param url
   * @returns
   */
  async get(
    url: string,
    rel?: {
      parent?: ICatalogCollection
      root?: ICatalog
    }
  ): Promise<IStoreChild> {
    if (url in this.children) {
      return this.children[url]
    }

    return this.load(url, rel)
  }

  async get_root_catalog(url: string, walk: boolean = false): Promise<Catalog> {
    const catalog = (await this.get(url)) as Catalog
    catalog.root = catalog
    this.children[url] = catalog

    console.log(walk)

    return catalog
  }
}
