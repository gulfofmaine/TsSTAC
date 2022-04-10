import { Item } from '../src/item'

describe('Item', () => {
  it('Can be created from an object', () => {
    const item = new Item(itemData)

    expect(item.id).toEqual('LC80101172015002LGN00')
  })

  it('Can be described', async () => {
    const item = new Item(itemData)

    const description = await item.describe()

    expect(description).toEqual('* <Item LC80101172015002LGN00>')
  })
})

const itemData = require('./test_data/landsat-8-l1/010/117/2015-01-02/LC80101172015002LGN00.json')
