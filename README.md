# TsSTAC

TsSTAC is designed as a [Sans-I/O style library](https://sans-io.readthedocs.io/index.html) for loading and managing [SpatioTemporal Asset Catalogs](https://stacspec.org/).

## Why Sans-I/O?

There are many different ways to fetch data in Javascript, so to make the library the most useful, we shouldn't force any specific one on users.
We can however provide a reference implementation, so that users don't have to provide their own.

By not tieing an IO method we can better accomidate different access patterns such as:
- [Single File STAC](https://github.com/stac-extensions/single-file-stac)
- Eager caching and re-hydration with [React-Query](https://github.com/stac-extensions/single-file-stac)
- Loading data from the filesystem for server side use
- Baking a catalog into an app to save preloading.

## Using TsSTAC

```ts
import STAC from "tsstac"
import fetcher from "tsstac/reference-fetch"

// Create a STAC store
// This will be in charge of loading data, and mapping from loaded URLs
// to STAC catalogs, collections, and items
const stac_store = STAC(fetch=fetcher)

// Here we're loading up the catalog for landsat from S3,
// but we are choosing to delay loading child links
// until later rather than walking the whole catalog on load
const landsat_catalog = await stac_store.get_catalog("https://landsat-stac.s3.amazonaws.com/catalog.json", walk=false)

// We can quickly view the structure of a catalog (or other STAC objects)
// by describing them
console.log(await landsat_catalog.describe(depth=2))
```
