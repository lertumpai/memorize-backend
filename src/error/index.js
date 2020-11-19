class CustomError extends Error {
  constructor(name, message) {
    super(name)
    this.name = name
    this.message = message
  }
}

export class DUPLICATED_VALUE_ERROR extends CustomError {
  constructor(value) {
    super('DUPLICATED_VALUE_ERROR', { [value]: `${value} is duplicated` })
  }
}

export class NOT_FOUND_ERROR extends CustomError {
  constructor(value) {
    super('NOT_FOUND_ERROR', { [value]: `${value} is not found` })
  }
}

export class LOGIN_FAIL_ERROR extends CustomError {
  constructor(values) {
    const message = values.reduce((result, value) => ({ ...result, [value]: `${value} is invalid` }), {})
    super('LOGIN_FAIL_ERROR', message)
  }
}