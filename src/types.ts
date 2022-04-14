import { BBox, Feature, Polygon } from 'geojson'

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

  /**
   * Filter links to those that contain children catalogs and collections
   */
  get_child_links(): ILink[]

  /**
   * Filter links to those that contain items
   */
  get_item_links(): ILink[]

  /**
   * Return a string description of the STAC tree to a given depth
   * below current object.
   * @param depth Depth to traverse below current object when generating tree,
   * -1 will go till the tree is exhausted
   * @param spaces Number of spaces to pad tree with, usually used for recursing.
   */
  describe(depth: number, spaces: string): Promise<string>
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

export interface IAsset extends IAssetData {
  roles: string[]
  extra_fields?: { [key: string]: any }
}

export interface ICatalogCollection extends ISTACObject {
  description: string

  /**
   * Return the children catalogs and collections by loading them if necessary
   */
  get_children(): Promise<(ICatalog | ICollection)[]>

  // /**
  //  * Get a specific catalog or collection by ID
  //  *
  //  * @param id ID of child collection or catalog to return
  //  * @param depth Maximum depth to search, -1 will search full depth
  //  */
  get_child(id: string, depth: number): Promise<ICatalog | ICollection>

  /**
   * Return the items by loading if necessary
   */
  get_items(): Promise<IItem[]>

  /**
   * Find a specific item by ID
   *
   * @param id Item ID
   * @param depth Maximum depth to search, -1 will search all children of the catalog/collection until found
   */
  get_item(id: string, depth: number): Promise<IItem>

  /**
   * Recursively load the catalog or collection until a given depth
   * @param depth -1 will load the entire catalog, 1 will just load the children
   */
  recursive_load(depth: number): Promise<void>
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
  assets: { [key: string]: IAsset }
}

export interface IItem extends ISTACObject, Feature<Polygon> {
  id: string
  type: 'Feature'
  collection?: string
  assets: { [key: string]: IAsset }
  extra_fields?: { [key: string]: any }

  // get_collection(): Promise<ICollection | ICatalog>
}

export interface IItemData {
  id: string
  stac_version: string
  title?: string
  description: string
  stac_extensions?: string[]
  type: string
  bbox?: BBox
  geometry: {
    type: 'Polygon'
    coordinates: number[][][]
  }
  properties: {}
  assets: {
    [key: string]: IAssetData
  }
  links: ILink[]
  collection?: string
}

// export type IStoreChild = ISTACObject;
export type IStoreChild = ICatalog | ICollection | IItem
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
