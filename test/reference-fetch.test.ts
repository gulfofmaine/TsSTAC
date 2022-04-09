import fetchMock from 'jest-fetch-mock'

import { fetcher } from '../src/reference-fetch'
import { mockLandsatCatalog } from './mock_landsat'

const catalogUrl = 'https://landsat-stac.s3.amazonaws.com/catalog.json'

describe('Reference fetcher', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it('Can fetch a catalog', async () => {
    mockLandsatCatalog()

    const catalog = await fetcher(catalogUrl)

    expect(catalog.id).toEqual('landsat-stac')
    expect(fetch).toHaveBeenCalledTimes(1)
  })
})
