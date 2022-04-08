export interface IFetchFn {
  (url: string): Promise<IStoreChild>;
}

export interface ILink {
  href: string;
  rel: string;
  media_type?: string;
  extra_fields?: { [key: string]: any };
}

export interface ISTACObject {
  type: string;
  id: string;
  stac_version: string;
  title?: string;
  description?: string;
  links: ILink[];
  stac_extensions?: string[];
  store?: ISTAC;
  self_href?: string;
}

export interface ICatalogData {
  type?: string;
  id: string;
  stac_version: string;
  title?: string;
  description: string;
  links: ILink[];
  stac_extensions?: string[];
}

export interface ICatalogCollection extends ISTACObject {
  //   get_child_links(): ILink[];
  //   get_item_links(): ILink[];
  //   get_child(id: string, recursive: boolean): Promise<ICatalogCollection>;
  //   get_item(id: string, recursive: boolean): Promise<IItem>;
  //   describe(depth: number, walk: boolean): Promise<string>;
}

export interface ICatalog extends ICatalogCollection {
  type: 'Catalog';
  description: string;
  store?: ISTAC;
  self_href?: string;
}

export interface ICollection extends ICatalogCollection {
  type: 'Collection';
}

export interface IItem extends ISTACObject {
  type: 'Feature';
  collection: string;

  get_collection(): Promise<ICollection>;

  //   describe(depth: number, walk: boolean): Promise<string>;
}

export type IStoreChild = ISTACObject;

export interface IStoreChilden {
  [key: string]: IStoreChild;
}

export interface ISTAC {
  fetcher: IFetchFn;

  load(url: string): Promise<IStoreChild>;
  get(url: string): Promise<IStoreChild>;
  get_catalog(url: string, walk: boolean): Promise<ICatalog>;
}
