import fetchMock from 'jest-fetch-mock'

import { fetcher } from '../src/reference-fetch'
import { STAC } from '../src/stac_store'
import { Collection } from '../src/collection'
import { catalogUrl, mockLandsatCatalog, landsatUrls } from './mock_landsat'
// import { Catalog } from '../src/catalog'

describe('Landsat Catalog', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
    mockLandsatCatalog()
  })

  it('Can load an item', async () => {
    const stac = new STAC(fetcher)
    const catalog = await stac.get(catalogUrl)

    expect(catalog.id).toEqual('landsat-stac')
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('Can get an item twice and only load data once', async () => {
    const stac = new STAC(fetcher)
    const catalog = await stac.get(catalogUrl)

    expect(catalog.id).toEqual('landsat-stac')
    expect(catalog.self_href).toEqual(catalogUrl)
    expect(fetch).toHaveBeenCalledTimes(1)

    const catalog2 = await stac.get(catalogUrl)
    expect(catalog2.id).toEqual('landsat-stac')
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('Can load a catalog only once', async () => {
    const stac = new STAC(fetcher)
    const catalog = await stac.get_root_catalog(catalogUrl)

    expect(catalog.id).toEqual('landsat-stac')
    expect(fetch).toHaveBeenCalledTimes(1)

    const catalog2 = await stac.get(catalogUrl)
    expect(catalog2.id).toEqual('landsat-stac')
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('Can find a child on a catalog', async () => {
    const stac = new STAC(fetcher)
    const catalog = await stac.get_root_catalog(catalogUrl)

    const child = catalog.get_child_links()[0]
    const childUrl = catalog.url_for_link(child)

    expect(childUrl).toEqual(landsatUrls['landsat-8-l1']['catalog.json'])
  })

  it('Can load children of a catalog', async () => {
    const stac = new STAC(fetcher)
    const catalog = await stac.get_root_catalog(catalogUrl)

    const child = (await catalog.get_children())[0]
    const collection = await stac.get(
      landsatUrls['landsat-8-l1']['catalog.json']
    )
    expect(fetch).toHaveBeenCalledTimes(2)
    expect(fetch).toHaveBeenCalledWith(catalogUrl)
    expect(fetch).toHaveBeenCalledWith(
      landsatUrls['landsat-8-l1']['catalog.json']
    )

    expect(child.root).toBe(catalog)
    expect(collection.root).toBe(catalog)
    expect(collection).toBe(child)
    expect(child.parent).toBe(catalog)
  })

  it('Can load grandchildren', async () => {
    const stac = new STAC(fetcher)
    const catalog = await stac.get_root_catalog(catalogUrl)

    const child = (await catalog.get_children())[0] as Collection
    expect(child.get_child_links()).toHaveLength(2)

    const grandchildren = await child.get_children()

    expect(grandchildren).toHaveLength(2)
    expect(fetch).toHaveBeenCalledTimes(4)
    expect(fetch).toHaveBeenCalledWith(catalogUrl)
    expect(fetch).toHaveBeenCalledWith(
      landsatUrls['landsat-8-l1']['catalog.json']
    )
    expect(fetch).toHaveBeenCalledWith(
      landsatUrls['landsat-8-l1']['010']['catalog.json']
    )
    expect(fetch).toHaveBeenCalledWith(
      landsatUrls['landsat-8-l1']['026']['catalog.json']
    )
  })

  it('Can recursively load a catalog', async () => {
    const stac = new STAC(fetcher)
    const catalog = await stac.get_root_catalog(catalogUrl)

    await catalog.recursive_load(2)

    expect(fetch).toHaveBeenCalledTimes(4)
    expect(fetch).toHaveBeenCalledWith(catalogUrl)
    expect(fetch).toHaveBeenCalledWith(
      landsatUrls['landsat-8-l1']['catalog.json']
    )
    expect(fetch).toHaveBeenCalledWith(
      landsatUrls['landsat-8-l1']['010']['catalog.json']
    )
    expect(fetch).toHaveBeenCalledWith(
      landsatUrls['landsat-8-l1']['026']['catalog.json']
    )
  })

  it('Can describe a tree', async () => {
    const stac = new STAC(fetcher)
    const catalog = await stac.get_root_catalog(catalogUrl)

    const description = await catalog.describe(-1)

    expect(description).toContain('* <Catalog landsat-stac>')
    expect(description).toContain('  * <Collection landsat-8-l1>')
    expect(description).toContain('    * <Catalog 010>')
    expect(description).toContain('      * <Catalog 117>')
    expect(description).toContain('       * <Item LC80101172015002LGN00>')
    expect(description).toContain('       * <Item LC80101172015018LGN00>')
    expect(description).toContain('      * <Catalog 120>')
    expect(description).toContain('       * <Item LC80101202015002LGN00>')
    expect(description).toContain('       * <Item LC80101202021034>')
    expect(description).toContain('    * <Catalog 026>')
    expect(description).toContain('      * <Catalog 039>')
    expect(description).toContain('       * <Item LC80260392015002LGN00>')
    expect(description).toContain('       * <Item LC80260392015018LGN00>')
  })

  it('Can description will be limited by depth', async () => {
    const stac = new STAC(fetcher)
    const catalog = await stac.get_root_catalog(catalogUrl)

    const description = await catalog.describe(3)

    expect(description).toContain('* <Catalog landsat-stac>')
    expect(description).toContain('  * <Collection landsat-8-l1>')
    expect(description).toContain('    * <Catalog 010>')
    expect(description).toContain('      * <Catalog 117>')
    expect(description).not.toContain('       * <Item LC80101172015002LGN00>')
    expect(description).not.toContain('       * <Item LC80101172015018LGN00>')
    expect(description).toContain('      * <Catalog 120>')
    expect(description).not.toContain('       * <Item LC80101202015002LGN00>')
    expect(description).not.toContain('       * <Item LC80101202021034>')
    expect(description).toContain('    * <Catalog 026>')
    expect(description).toContain('      * <Catalog 039>')
    expect(description).not.toContain('       * <Item LC80260392015002LGN00>')
    expect(description).not.toContain('       * <Item LC80260392015018LGN00>')
  })

  it('Can find an item by ID', async () => {
    const stac = new STAC(fetcher)
    const catalog = await stac.get_root_catalog(catalogUrl)

    const id = 'LC80101202015002LGN00'
    const item = await catalog.get_item(id)

    expect(item.id).toEqual(id)

    const id2 = 'LC80260392015018LGN00'
    const item2 = await catalog.get_item(id2)

    expect(item2.id).toEqual(id2)
  })

  it("Can't get an item when the depth is limited", async () => {
    const stac = new STAC(fetcher)
    const catalog = await stac.get_root_catalog(catalogUrl)

    const id = 'LC80101202015002LGN00'

    await expect(catalog.get_item(id, 1)).rejects.toThrowError(
      "Couldn't find item"
    )
  })

  it("Can't get and item that does not exist", async () => {
    const stac = new STAC(fetcher)
    const catalog = await stac.get_root_catalog(catalogUrl)

    const badId = 'does-not-exist'

    await expect(catalog.get_item(badId)).rejects.toThrowError(
      "Couldn't find item"
    )
  })

  it('Can get a child by ID', async () => {
    const stac = new STAC(fetcher)
    const catalog = await stac.get_root_catalog(catalogUrl)

    const id = '039'
    const child = await catalog.get_child(id)

    expect(child.id).toEqual(id)
  })

  it('Cannot get a child whe the depth is limited', async () => {
    const stac = new STAC(fetcher)
    const catalog = await stac.get_root_catalog(catalogUrl)

    const id = '039'

    await expect(catalog.get_child(id, 1)).rejects.toThrowError(
      "Couldn't find child"
    )
  })

  it('Cannot get a child that does not exist', async () => {
    const stac = new STAC(fetcher)
    const catalog = await stac.get_root_catalog(catalogUrl)

    const badId = 'does-not-exist'

    await expect(catalog.get_child(badId)).rejects.toThrowError(
      "Couldn't find child"
    )
  })

  // it('Can load a collection and items', async () => {
  //   const stac = new STAC(fetcher)
  //   const row_catalog = (stac.get(
  //     landsatUrls['landsat-8-l1']['026']['039']['catalog.json']
  //   ) as unknown) as Catalog

  //   expect(row_catalog.get_item_links()).toHaveLength(2)
  // })
})
