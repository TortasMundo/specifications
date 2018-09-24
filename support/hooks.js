const { After, AfterAll } = require('cucumber')
const Bluebird = require('bluebird')
const config = require('../config')
const Knex = require('knex')
const KnexFile = require('./knexfile')
const knex = Knex(KnexFile)
const redis = require('thunk-redis')
const redisClient = redis.createClient(config.redis_host, {
  database: 1,
  usePromise: Bluebird,
  returnBuffers: false,
  maxAttempts: Infinity,
  retryMaxDelay: 15 * 1000,
  noDelay: true,
})

After(async function() {
  await redisClient.flushall()
  this.kitchenSockets.map(s => s.disconnect())
  this.kitchenSockets = {}
  this.socketLocks = this.initSocketLocks
  await knex('orders').truncate()
})

AfterAll(async function() {
  await redisClient.flushall()
  await knex('orders').truncate()
  await knex.destroy()
  await redisClient.quit()
})
