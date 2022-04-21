/**
 * STAC Datacube extension
 *
 * https://github.com/stac-extensions/datacube
 */
import { IItem, ICollection } from '../types'

export interface DataCubeDimensions {
  [key: string]: Dimension
}

export type Dimension =
  | HorizontalSpatialDimension
  | VerticalSpatialDimension
  | TemporalDimension
  | AdditionalDimension

interface BaseDimension {
  type: string
  description?: string
  extent?: number[]
  values?: Array<number | string>
}

export type ReferenceSystem = string | number | object

export interface HorizontalSpatialDimension extends BaseDimension {
  type: 'spatial'
  axis: 'x' | 'y'
  reference_system?: ReferenceSystem
  values?: number[]
  step?: number
}

export interface VerticalSpatialDimension extends BaseDimension {
  type: 'spatial'
  axis: 'z'
  unit?: string
  reference_system?: ReferenceSystem
  step?: number
}

export interface TemporalDimension extends BaseDimension {
  type: 'temporal'
  values?: string[]
  step?: string
}

export interface AdditionalDimension extends BaseDimension {
  step?: number
  unit?: string
  reference_system?: string
}

export interface Variable {
  dimensions: string[]
  type: 'data' | 'auxiliary'
  description?: string
  extent?: Array<number | string>
  values?: Array<number | string>
  unit?: string
}

export interface DataCubeItem extends IItem {
  properties: {
    'cube:dimensions': {
      [key: string]: Dimension
    }
    'cube:variables': {
      [key: string]: Variable
    }
  }
}

export interface DataCubeCollection extends ICollection {
  'cube:dimensions': {
    [key: string]: Dimension
  }
  'cube:variables': {
    [key: string]: Variable
  }
}
