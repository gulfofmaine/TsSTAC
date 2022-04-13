import { IAsset, IAssetData } from './types'

export class Asset implements IAsset {
  href: string
  title?: string
  description?: string
  type?: string
  roles: string[]
  extra_fields?: { [key: string]: any }

  constructor(asset_obj: IAssetData & object) {
    const { href, title, description, type, roles, ...extra } = asset_obj

    this.href = href
    this.title = title
    this.description = description
    this.type = type
    this.roles = roles ?? []

    this.extra_fields = extra
  }
}
