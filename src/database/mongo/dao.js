export default class Dao {
  constructor(model) {
    this.model = model
  }

  findOneById(id) {
    return this.model.findById(id)
  }
}