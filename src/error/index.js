class CustomError extends Error {
  constructor(name, message) {
    super(name)
    this.name = name
    this.message = message
  }

  // toJSON() {
  //   return {
  //     name: this.name,
  //     errors: this.message,
  //   }
  // }
}

const DUPLICATED_VALUE_ERROR_NAME = 'DUPLICATED_VALUE_ERROR'
export class DUPLICATED_VALUE_ERROR extends CustomError {
  constructor(value) {
    super(DUPLICATED_VALUE_ERROR_NAME, value)
  }
}