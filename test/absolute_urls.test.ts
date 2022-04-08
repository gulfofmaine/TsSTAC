import { isAbsoluteUrl } from '../src/absolute_url';

describe('Absolute URL helpers', () => {
  it('Is an absolute URL', () => {
    const url =
      'https://landsat-stac.s3.amazonaws.com/landsat-8-l1/010/catalog.json';

    expect(isAbsoluteUrl(url)).toBeTruthy();
  });

  it('Is not an absolute URL', () => {
    const url = '../../catalog.json';

    expect(isAbsoluteUrl(url)).toBeFalsy();
  });
});
