import DataLoader from 'dataloader'

import { INVALID_SERIALIZER_ERROR } from '../../error'

export default class Dao {
  constructor(model) {
    this.model = model
    this.loader = new DataLoader(keys => this.findByBatchIds(keys, this.model), { cache: true })
  }

  // eslint-disable-next-line no-unused-vars
  serializer(data) {
    throw new INVALID_SERIALIZER_ERROR()
  }

  findById(id) {
    return id ? this.loader.load(id.toString()) : null
  }

  clear(id) {
    return id ? this.loader.clear(id.toString()) : null
  }

  clearAll() {
    return this.loader.clearAll()
  }

  async findByBatchIds(keys, model) {
    const results = await model.find({ _id: { $in: keys } })
    return keys.map(key => results.find(result => result.id === key)).map(this.serializer)
  }

  async queryAfterBeforeLimit(filter, { after, before, limit = 10, sortBy = '_id', order = 'DESC' }) {
    let prepareFilter = { ...filter }
    let prepareOrder = order

    if (!!after && !!before) {
      prepareFilter = { ...filter, [sortBy]: { $gte: after, $lte: before } }
      prepareOrder = 'ASC'
    } else if (after) {
      prepareFilter = { ...filter, [sortBy]: { $gt: after } }
      prepareOrder = 'ASC'
    } else if (before) {
      prepareFilter = { ...filter, [sortBy]: { $lt: before } }
    }

    const sort = { [sortBy]: prepareOrder === 'DESC' ? -1 : 1 }

    const data = await this.model.find(prepareFilter, null, { limit: limit + 1, sort })

    return {
      data: data.slice(0, limit).map(this.serializer),
      hasMore: data.length > limit,
    }
  }

  async deleteById(id, { date }) {
    await this.clear(id)
    return this.model.findOneAndUpdate({ _id: id }, { active: false, updatedAt: date, deletedAt: date }, { new: true }).then(this.serializer)
  }
}
