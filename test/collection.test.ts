import { Collection } from '../src/collection'
import { Link } from '../src/link'

describe('Collection', () => {
  it('Can be created from an object', () => {
    const collection = new Collection(collectionData)

    expect(collection.id).toEqual('landsat-8-l1')
  })

  it('Has child links', () => {
    const collection = new Collection(collectionData)
    const children_links = collection.get_child_links()

    expect(children_links).toContainEqual(
      new Link({
        rel: 'child',
        href: '010/catalog.json',
      })
    )

    collection.self_href =
      'https://landsat-stac.s3.amazonaws.com/landsat-8-l1/catalog.json'

    const child_urls = children_links.map((l) => collection.url_for_link(l))

    expect(child_urls).toContainEqual(
      'https://landsat-stac.s3.amazonaws.com/landsat-8-l1/010/catalog.json'
    )
  })

  it('Does not have item links', () => {
    const collection = new Collection(collectionData)
    const item_links = collection.get_item_links()

    expect(item_links).toHaveLength(0)
  })

  it('get_children throws error with no store configured', async () => {
    const collection = new Collection(collectionData)

    await expect(collection.get_children()).rejects.toThrowError(
      'There is no store configured, cannot load children'
    )
  })

  it('Can be described', async () => {
    const collection = new Collection(collectionData)

    const description = await collection.describe(0)

    expect(description).toEqual('* <Collection landsat-8-l1>')
  })
})

const collectionData = require('./test_data/landsat-8-l1/catalog.json')
