import { STACObject } from './stac_object'
import {
  ICatalogCollection,
  IStoreChild,
  ICatalog,
  ICollection,
  IItem,
} from './types'

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
      const child: IStoreChild = (await this.store.get(child_url, {
        parent: this as ICatalogCollection,
        root: this.root,
      })) as ICatalog | ICollection
      children.push(child)
    }

    return children
  }

  get_child = async (
    id: string,
    depth: number = -1
  ): Promise<ICatalog | ICollection> => {
    const children = await this.get_children()

    for (const child of children) {
      if (child.id === id) {
        return child
      }
    }

    if (depth !== 0) {
      for (const child of children) {
        try {
          const result = await child.get_child(id, depth - 1)
          return result
        } catch (e) {
          let message: string | undefined = undefined

          if (typeof e === 'string') {
            message = e
          } else if (e instanceof Error) {
            message = e.message
          }

          if (message?.includes("Couldn't find child")) {
            continue
          } else {
            throw e
          }
        }
      }
    }

    throw new Error(`Couldn't find child ${id} in ${this.id}`)
  }

  get_items = async (): Promise<IItem[]> => {
    if (!this.store) {
      throw new Error('There is no store configured, cannot load items')
    }

    const item_links = this.get_item_links()
    const items: Array<IItem> = []

    for (const item_link of item_links) {
      const item_url = this.url_for_link(item_link)
      const item: IStoreChild = (await this.store.get(item_url, {
        parent: this as ICatalogCollection,
        root: this.root,
      })) as IItem
      items.push(item)
    }
    return items
  }

  get_item = async (id: string, depth: number = -1): Promise<IItem> => {
    const items = await this.get_items()
    for (const item of items) {
      if (item.id === id) {
        return item
      }
    }

    if (depth !== 0) {
      const children = await this.get_children()

      for (const child of children) {
        try {
          const item = await child.get_item(id, depth - 1)
          return item
        } catch (e) {
          let message: string | undefined = undefined

          if (typeof e === 'string') {
            message = e
          } else if (e instanceof Error) {
            message = e.message
          }

          if (message?.includes("Couldn't find item")) {
            continue
          } else {
            throw e
          }
        }
      }
    }

    throw new Error(`Couldn't find item ${id} in ${this.id}`)
  }

  abstract describe(depth: number, spaces: string): Promise<string>

  async recursive_load(depth: number): Promise<void> {
    if (depth !== 0) {
      const children = await this.get_children()

      for (const child of children) {
        await child.recursive_load(depth - 1)
      }

      // Promise.all(
      //   children.map(async child => {
      //     return await child.recursive_load(depth - 1)
      //   })
      // )
    }
  }
}
