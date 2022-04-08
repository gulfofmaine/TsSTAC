import { ICatalog, IFetchFn, ISTAC, IStoreChild, IStoreChilden } from './types';

import { Catalog } from './catalog';

export class STAC implements ISTAC {
  private children: IStoreChilden = {};

  constructor(public fetcher: IFetchFn) {}

  /**
   * Load a STAC catalog, collection, or item from a given URL or path
   *
   * @param url
   * @returns
   */
  async load(url: string): Promise<IStoreChild> {
    const item = await this.fetcher(url);
    item.store = this;
    item.self_href = url;

    this.children[url] = item;

    return item;
  }

  /**
   *
   * @param url
   * @returns
   */
  async get(url: string): Promise<IStoreChild> {
    if (url in this.children) {
      return this.children[url];
    }

    return this.load(url);
  }

  async get_catalog(url: string, walk: boolean = true): Promise<Catalog> {
    const catalog = new Catalog((await this.get(url)) as ICatalog);

    console.log(walk);

    return catalog;
  }
}
