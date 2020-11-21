export default class Dao {
  constructor(model) {
    this.model = model
  }

  findById(id) {
    return this.model.findById(id)
  }

  deleteById(id) {
    return this.model.findOneAndUpdate(id, { active: false }, { new: true })
  }
}