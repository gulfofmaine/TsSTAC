import fetchMock from 'jest-fetch-mock';

import { fetcher } from '../src/reference-fetch';
import { STAC } from '../src/stac_store';
import { catalogUrl, mockLandsatCatalog } from './mock_landsat';

describe('STAC Store', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    mockLandsatCatalog();
  });

  it('Can load an item', async () => {
    const stac = new STAC(fetcher);
    const catalog = await stac.get(catalogUrl);

    expect(catalog.id).toEqual('landsat-stac');
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('Can get an item twice and only load data once', async () => {
    const stac = new STAC(fetcher);
    const catalog = await stac.get(catalogUrl);

    expect(catalog.id).toEqual('landsat-stac');
    expect(catalog.self_href).toEqual(catalogUrl);
    expect(fetch).toHaveBeenCalledTimes(1);

    const catalog2 = await stac.get(catalogUrl);
    expect(catalog2.id).toEqual('landsat-stac');
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('Can load a catalog', async () => {
    const stac = new STAC(fetcher);
    const catalog = await stac.get_catalog(catalogUrl);

    expect(catalog.id).toEqual('landsat-stac');
    expect(fetch).toHaveBeenCalledTimes(1);

    console.log(catalog);

    const catalog2 = await stac.get(catalogUrl);
    expect(catalog2.id).toEqual('landsat-stac');
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
