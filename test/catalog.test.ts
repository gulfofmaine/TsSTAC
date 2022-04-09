import { Catalog } from '../src/catalog'
import { Link } from '../src/link'

describe('Catalog', () => {
  it('Can be created from an object', () => {
    const catalog = new Catalog(catalogData)

    expect(catalog.id).toEqual('landsat-stac')
  })

  it('Has a child link', () => {
    const catalog = new Catalog(catalogData)
    const children = catalog.get_child_links()

    expect(children).toContainEqual(
      new Link({
        rel: 'child',
        href: 'landsat-8-l1/catalog.json',
      })
    )

    catalog.self_href = 'https://landsat-stac.s3.amazonaws.com/catalog.json'

    const child = children[0]
    const childUrl = catalog.url_for_link(child)

    expect(childUrl).toEqual(
      'https://landsat-stac.s3.amazonaws.com/landsat-8-l1/catalog.json'
    )
  })

  it('Does not have item links', () => {
    const catalog = new Catalog(catalogData)
    const items = catalog.get_item_links()

    expect(items).toHaveLength(0)
  })

  it('get_children throws error with no store configured', async () => {
    const catalog = new Catalog(catalogData)

    await expect(catalog.get_children()).rejects.toThrowError(
      'There is no store configured, cannot load children'
    )
  })

  it('Can be described', async () => {
    const catalog = new Catalog(catalogData)

    const description = await catalog.describe(0)

    expect(description).toEqual('* <Catalog landsat-stac>')
  })
})

const catalogData = require('./test_data/catalog.json')
