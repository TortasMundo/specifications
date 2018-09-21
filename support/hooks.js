const { After, AfterAll } = require('cucumber')
const Knex = require('knex')
const KnexFile = require('./knexfile')
const knex = Knex(KnexFile)

After(async function() {
  await knex('orders').truncate()
})

AfterAll(async function() {
  await knex('orders').truncate()
})
