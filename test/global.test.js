/* eslint no-console: "off" */

import mongoose from 'mongoose'
import { ConnectMongo } from '../src/database/mongo/connection'

export async function mochaGlobalSetup() {
  console.log('=== Setup before start test ===')
  await ConnectMongo()
  console.log('=== Finish setup ===')
  console.log()
}

export async function mochaGlobalTeardown() {
  console.log('=== Teardown after finish test ===')
  await mongoose.disconnect()
  process.exit()
  console.log('Disconnect Mongo')
  console.log('=== Finish teardown ===')
}
