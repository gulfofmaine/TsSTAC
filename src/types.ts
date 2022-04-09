export interface IFetchFn {
  (url: string): Promise<IFetchData>
}

export type IFetchData = ICatalogData | ICollectionData

export interface ILink {
  href: string
  rel: string
  media_type?: string
  extra_fields?: { [key: string]: any }
}

export interface ISTACObjectBase {
  type: string
  id: string
  stac_version: string
  title?: string
  description?: string
  links: ILink[]
  stac_extensions?: string[]
}

export interface ISTACObject extends ISTACObjectBase {
  store?: ISTAC
  self_href?: string
  parent?: ICatalogCollection
  root?: ICatalog
}

export interface ICatalogData {
  type?: string
  id: string
  stac_version: string
  title?: string
  description: string
  links: ILink[]
  stac_extensions?: string[]
}

export interface ICollectionData {
  type?: string
  stac_version: string
  stac_extensions?: string[]
  id: string
  title?: string
  description: string
  keywords?: string[]
  license: string
  providers: object[]
  extent: object
  summaries?: { [key: string]: object }
  links: ILink[]
  assets?: { [key: string]: IAssetData }
}

export interface IAssetData {
  href: string
  title?: string
  description?: string
  type?: string
  roles?: string[]
}

export interface ICatalogCollection extends ISTACObject {
  description: string

  /**
   * Return the children catalogs and collections by loading them if necessary
   */
  get_children(): Promise<(ICatalog | ICollection)[]>

  // store?: ISTAC
  // self_href?: string
  //   get_child_links(): ILink[];
  //   get_item_links(): ILink[];
  //   get_child(id: string, recursive: boolean): Promise<ICatalogCollection>;
  //   get_item(id: string, recursive: boolean): Promise<IItem>;
  //   describe(depth: number, walk: boolean): Promise<string>;
}

export interface ICatalog extends ICatalogCollection {
  type: 'Catalog'
}

export interface ICollection extends ICatalogCollection {
  type: 'Collection'
  keywords: string[]
  license: string
  providers: object[]
  extent: object
  summaries: { [key: string]: object }
  links: ILink[]
  assets: { [key: string]: IAssetData }
}

export interface IItem extends ISTACObject {
  type: 'Feature'
  collection?: string
  geometry: object | null
  bbox?: number[]
  assets: { [key: string]: object }

  get_collection(): Promise<ICollection>

  //   describe(depth: number, walk: boolean): Promise<string>;
}

// export type IStoreChild = ISTACObject;
export type IStoreChild = ICatalog | ICollection
// | ICollection | IItem

export interface IStoreChilden {
  [key: string]: IStoreChild
}

export interface ISTAC {
  fetcher: IFetchFn

  /**
   * Load a STAC object by URL
   * @param url URL of item to be loaded
   * @param rel Item relationships to set
   */
  load(
    url: string,
    rel?: {
      parent?: ICatalogCollection
      root?: ICatalog
    }
  ): Promise<IStoreChild>

  /**
   * Return an already loaded STAC object or load as needed
   * @param url URL of item to be loaded
   * @param rel Item relationships to set
   */
  get(
    url: string,
    rel?: {
      parent?: ICatalogCollection
      root?: ICatalog
    }
  ): Promise<IStoreChild>

  /**
   * Load a root catalog and optionally all of it's children
   *
   * @param url URL to the root catalog
   * @param walk Follow children and item links to assemble a full tree of STAC links
   */
  get_root_catalog(url: string, walk: boolean): Promise<ICatalog>
}
