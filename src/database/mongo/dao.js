export default class Dao {
  constructor(model) {
    this.model = model
  }

  findById(id) {
    return this.model.findById(id)
  }

  queryAfterBeforeLimit(filer, { after, before, limit = 10, sortBy = '_id', order = 'DESC' }) {
    let pagination
    if (!!after && !!before) {
      pagination = { $gte: after, $lte: before }
    } else if (after) {
      pagination = { $gt: after }
    } else if (before) {
      pagination = { $lt: before }
    }
  }

  deleteById(id, { date }) {
    return this.model.findOneAndUpdate({ _id: id }, { active: false, updatedAt: date, deletedAt: date }, { new: true })
  }
}