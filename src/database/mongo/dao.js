import DataLoader from 'dataloader'

export default class Dao {
  constructor(model) {
    this.model = model
    this.loader = new DataLoader(keys => this.findByBatchIds(keys, this.model))
  }

  findById(id) {
    return this.loader.load(id.toString())
  }

  clear(id) {
    return this.loader.clear(id.toString())
  }

  async findByBatchIds(keys, model) {
    const results = await model.find({ _id: { $in: keys } })
    return keys.map(key => results.find(result => result.id === key))
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

    return this.model.find(prepareFilter, null, { limit, sort })
  }

  deleteById(id, { date }) {
    return this.model.findOneAndUpdate({ _id: id }, { active: false, updatedAt: date, deletedAt: date }, { new: true })
  }
}
