import { IFetchFn, ISTACObject } from './types';

/**
 * Load JSON STAC objects from URL using browser fetch
 *
 * @param url HREF to load JSON object from
 * @returns STAC object
 */
export const fetcher: IFetchFn = async (url: string) => {
  const result = await fetch(url);
  const data = (await result.json()) as ISTACObject;

  return data;
};
