import { ICatalog, ICatalogData, ISTAC } from './types';
import { Link } from './link';

export class Catalog implements ICatalog {
  type = 'Catalog' as const;
  stac_version: string;
  stac_extensions: string[];
  id: string;
  title?: string | undefined;
  description: string;
  links: Link[];
  store?: ISTAC;
  extra_fields?: { [key: string]: any };
  self_href?: string;

  constructor(
    catalog_obj: ICatalogData & { store?: ISTAC; self_href?: string } & object
  ) {
    const {
      stac_version,
      stac_extensions,
      id,
      title,
      description,
      links,
      store,
      self_href,
      ...extra
    } = catalog_obj;
    this.stac_version = stac_version;
    this.stac_extensions = stac_extensions ?? [];
    this.id = id;
    this.title = title;
    this.description = description;
    this.links = links.map(l => new Link(l));
    this.store = store;
    this.self_href = self_href;
    this.extra_fields = extra;
  }

  /**
   * Filter links for catalog and collections
   * @returns Children Catalog and Collection links
   */
  get_child_links(): Link[] {
    return this.links.filter(l => l.rel === 'child');
  }

  /**
   * Filter links to items
   * @returns Children Item links
   */
  get_item_links(): Link[] {
    return this.links.filter(l => l.rel === 'item');
  }
}
