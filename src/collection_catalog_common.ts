import { STACObject } from './stac_object'
import { ICatalogCollection, IStoreChild, ICatalog, ICollection } from './types'

export abstract class CatalogCollectionCommon extends STACObject
  implements ICatalogCollection {
  abstract description: string

  get_children = async () => {
    if (!this.store) {
      throw new Error('There is no store configured, cannot load children')
    }
    const children_links = this.get_child_links()
    const children: Array<ICatalog | ICollection> = []

    for (const child_link of children_links) {
      const child_url = this.url_for_link(child_link)
      const child: IStoreChild = await this.store.get(child_url, {
        parent: this as ICatalogCollection,
        root: this.root,
      })
      children.push(child)
    }

    return children
  }
}
