import {
  IFetchFn,
  // , ISTACObject
} from './types'

/**
 * Load JSON STAC objects from URL using browser fetch
 *
 * @param url HREF to load JSON object from
 * @returns STAC object
 */
export const fetcher: IFetchFn = async (url: string) => {
  try {
    const result = await fetch(url)
    try {
      const data = await result.json()
      return data
    } catch (e) {
      throw new Error(`Error converting ${url} to JSON ${e}`)
    }
  } catch (e) {
    throw new Error(`Error loading ${url} ${e}`)
  }
}
