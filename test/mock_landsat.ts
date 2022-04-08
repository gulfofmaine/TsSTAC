import fetchMock from 'jest-fetch-mock';

export const catalogUrl = 'https://landsat-stac.s3.amazonaws.com/catalog.json';
export const landsatUrls = {
  'catalog.json': catalogUrl,
  'landsat-8-l1': {
    'catalog.json':
      'https://landsat-stac.s3.amazonaws.com/landsat-8-l1/catalog.json',
    '010': {
      'catalog.json':
        'https://landsat-stac.s3.amazonaws.com/landsat-8-l1/010/catalog.json',
      '117': {
        'catalog.json':
          'https://landsat-stac.s3.amazonaws.com/landsat-8-l1/010/117/catalog.json',
        '2015-01-02': {
          'LC80101172015002LGN00.json':
            'https://landsat-stac.s3.amazonaws.com/landsat-8-l1/010/117/2015-01-02/LC80101172015002LGN00.json',
        },
        '2015-01-18': {
          'LC80101172015018LGN00.json':
            'https://landsat-stac.s3.amazonaws.com/landsat-8-l1/010/117/2015-01-18/LC80101172015018LGN00.json',
        },
      },
      '120': {
        'catalog.json':
          'https://landsat-stac.s3.amazonaws.com/landsat-8-l1/010/120/catalog.json',
        '2015-01-02': {
          'LC80101202015002LGN00.json':
            'https://landsat-stac.s3.amazonaws.com/landsat-8-l1/010/120/2015-01-02/LC80101202015002LGN00.json',
        },
        '2021-02-03': {
          'LC80101202021034.json':
            'https://landsat-stac.s3.amazonaws.com/landsat-8-l1/010/120/2021-02-03/LC80101202021034.json',
        },
      },
    },
    '026': {
      'catalog.json':
        'https://landsat-stac.s3.amazonaws.com/landsat-8-l1/026/catalog.json',
      '039': {
        'catalog.json':
          'https://landsat-stac.s3.amazonaws.com/landsat-8-l1/026/039/catalog.json',
        '2015-01-02': {
          'LC80260392015002LGN00.json':
            'https://landsat-stac.s3.amazonaws.com/landsat-8-l1/026/039/2015-01-02/LC80260392015002LGN00.json',
        },
        '2015-01-18': {
          'LC80260392015018LGN00.json':
            'https://landsat-stac.s3.amazonaws.com/landsat-8-l1/026/039/2015-01-18/LC80260392015018LGN00.json',
        },
      },
    },
  },
};

export function mockLandsatCatalog() {
  fetchMock.mockIf(
    catalogUrl,
    JSON.stringify(require('./test_data/catalog.json'))
  );

  fetchMock.mockIf(
    landsatUrls['landsat-8-l1']['catalog.json'],
    JSON.stringify(require('./test_data/landsat-8-l1/catalog.json'))
  );

  fetchMock.mockIf(
    landsatUrls['landsat-8-l1']['010']['catalog.json'],
    JSON.stringify(require('./test_data/landsat-8-l1/010/catalog.json'))
  );

  fetchMock.mockIf(
    landsatUrls['landsat-8-l1']['010']['117']['catalog.json'],
    JSON.stringify(require('./test_data/landsat-8-l1/010/117/catalog.json'))
  );
  fetchMock.mockIf(
    landsatUrls['landsat-8-l1']['010']['117']['2015-01-02'][
      'LC80101172015002LGN00.json'
    ],
    JSON.stringify(
      require('./test_data/landsat-8-l1/010/117/2015-01-02/LC80101172015002LGN00.json')
    )
  );
  fetchMock.mockIf(
    landsatUrls['landsat-8-l1']['010']['117']['2015-01-18'][
      'LC80101172015018LGN00.json'
    ],
    JSON.stringify(
      require('./test_data/landsat-8-l1/010/117/2015-01-18/LC80101172015018LGN00.json')
    )
  );

  fetchMock.mockIf(
    landsatUrls['landsat-8-l1']['010']['120']['catalog.json'],
    JSON.stringify(require('./test_data/landsat-8-l1/010/120/catalog.json'))
  );
  fetchMock.mockIf(
    landsatUrls['landsat-8-l1']['010']['120']['2015-01-02'][
      'LC80101202015002LGN00.json'
    ],
    JSON.stringify(
      require('./test_data/landsat-8-l1/010/120/2015-01-02/LC80101202015002LGN00.json')
    )
  );

  fetchMock.mockIf(
    landsatUrls['landsat-8-l1']['026']['catalog.json'],
    JSON.stringify(require('./test_data/landsat-8-l1/026/catalog.json'))
  );
  fetchMock.mockIf(
    landsatUrls['landsat-8-l1']['026']['039']['catalog.json'],
    JSON.stringify(require('./test_data/landsat-8-l1/026/039/catalog.json'))
  );
  fetchMock.mockIf(
    landsatUrls['landsat-8-l1']['026']['039']['2015-01-02'][
      'LC80260392015002LGN00.json'
    ],
    JSON.stringify(
      require('./test_data/landsat-8-l1/026/039/2015-01-02/LC80260392015002LGN00.json')
    )
  );
  fetchMock.mockIf(
    landsatUrls['landsat-8-l1']['026']['039']['2015-01-18'][
      'LC80260392015018LGN00.json'
    ],
    JSON.stringify(
      require('./test_data/landsat-8-l1/026/039/2015-01-18/LC80260392015018LGN00.json')
    )
  );
}
