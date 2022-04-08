import { Catalog } from '../src/catalog';
import { Link } from '../src/link';

describe('Catalog', () => {
  it('Can be created from an object', () => {
    const catalog = new Catalog(catalogData);

    expect(catalog.id).toEqual('landsat-stac');
  });

  it('Has a child link', () => {
    const catalog = new Catalog(catalogData);
    const children = catalog.get_child_links();

    expect(children).toContainEqual(
      new Link({
        rel: 'child',
        href: 'landsat-8-l1/catalog.json',
      })
    );
  });

  it('Does not have item links', () => {
    const catalog = new Catalog(catalogData);
    const items = catalog.get_item_links();

    expect(items).toHaveLength(0);
  });
});

const catalogData = require('./test_data/catalog.json');
