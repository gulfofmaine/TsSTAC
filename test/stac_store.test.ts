import fetchMock from 'jest-fetch-mock'

import { fetcher } from '../src/reference-fetch'
import { STAC } from '../src/stac_store'
import { Collection } from '../src/collection'
import { catalogUrl, mockLandsatCatalog, landsatUrls } from './mock_landsat'

describe('STAC Store', () => {
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
})
