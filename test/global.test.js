/* eslint no-console: "off" */

// import mongoose from 'mongoose'
//
// import { connectMongo } from '../../src/databases/mongo/connection'
// import { utils } from '../utils/api'

export async function mochaGlobalSetup() {
  console.log('=== Setup before start test ===')
  // await connectMongo()
  // await utils.mongo.clearAll()
  console.log('=== Finish setup ===')
  console.log()
}

export async function mochaGlobalTeardown() {
  console.log('=== Teardown after finish test ===')
  // await mongoose.disconnect()
  console.log('Disconnect Mongo')
  console.log('=== Finish teardown ===')
}
