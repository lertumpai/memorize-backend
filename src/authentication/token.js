import jwt from 'jsonwebtoken'
import _ from 'lodash'

export function token({userId, username, profile}) {
  return jwt.sign({userId, username, profile}, PRIVATE_KEY)
}

export function verifyToken(req, res, next) {
  if (_.isNil(req.headers)) {
    return next(new Error(TOKEN_INVALID))
  }

  const {authorization} = req.headers
  const token = authorization.replace('Memorize ', '')
  try {
    const extracedToken = jwt.verify(token, process.env.PRIVATE_KEY)
    req.userId = extracedToken.userId
    next()
  } catch (err) {
    next(err)
  }
}