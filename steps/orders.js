const R = require('ramda')
const config = require('config')
const {Given, When, Then} = require('cucumber')
const GetOrdersRequest = require('support/web/requests/kitchen-api/orders/list')
const PlaceOrderRequest = require('support/web/requests/order-taker-api/orders/place')
const {expect} = require('chai')
const Knex = require('knex')
const KnexFile = require('../support/knexfile')
const knex = Knex(KnexFile)
const moment = require('moment-timezone')

Given('there was an order registered yesterday', async function () {
  await knex('orders').insert({
    customer_code: '0',
    code: '123',
    deliverer_id: '0',
    store_id: 1,
    jamon_quantity: '0',
    lomo_quantity: '1',
    especial_quantity: '0',
    refrescos_quantity: '0',
    total: 50,
    status: 'ORDERED',
    paid_online: false,
    customer_location_latitude: '',
    customer_location_longitude: '',
    ordered_at: moment().subtract(1, 'days'),
  })
  await knex.destroy()
})

Given('Order Taker places an order', async function (jamon) {
  const request = new PlaceOrderRequest.Builder().build()
  await this.send(request)
})

Given('Order Taker places an order with {int} jamon', async function (jamon) {
  const request = new PlaceOrderRequest.Builder().withJamon(jamon).build()
  await this.send(request)
})

Given('Kitchen subscribes to socket to get new orders', async function () {
  const socket = this.createKitchenSocket()
  socket.emit('subscribe_for_order_placements', config.store_location)
  await this.sleep(300)
})

When('Order Taker places an order with {int} lomo, {int} especial', async function (lomo, especial) {
  const request = new PlaceOrderRequest.Builder()
    .withLomo(lomo)
    .withEspecial(especial)
    .build()
  await this.send(request)
})

When('Kitchen sends request to get last orders', async function () {
  const request = new GetOrdersRequest.Builder().build()
  await this.send(request)
})

When('Kitchen updates last order to {string}', function (string) {
  // Write code here that turns the phrase above into concrete actions
  return 'pending'
})

Then('Kitchen should receive one order', function () {
  expect(this.lastResponse.data.length).to.eql(1)
})

Then(
  'Kitchen should receive an order with {string} jamon, {string} lomo, {string} especial and {string} refrescos',
  function (jamon, lomo, especial, refrescos) {
    expect(this.lastResponse.data.length).to.eql(1)
    expect(this.lastResponse.data[0].jamon_quantity).to.eql(jamon)
    expect(this.lastResponse.data[0].lomo_quantity).to.eql(lomo)
    expect(this.lastResponse.data[0].especial_quantity).to.eql(especial)
    expect(this.lastResponse.data[0].refrescos_quantity).to.eql(refrescos)
  },
)

Then(
  'Kitchen should see an order with {string} jamon, {string} lomo, {string} especial and {string} refrescos',
  async function (jamon, lomo, especial, refrescos) {
    await this.awaitForSocket('placedOrder')
    expect(this.state.kitchen.orders.length).to.eql(1)
    expect(this.state.kitchen.orders[0].jamonQuantity.toString()).to.eql(jamon)
    expect(this.state.kitchen.orders[0].lomoQuantity.toString()).to.eql(lomo)
    expect(this.state.kitchen.orders[0].especialQuantity.toString()).to.eql(especial)
    expect(this.state.kitchen.orders[0].refrescosQuantity.toString()).to.eql(refrescos)
  },
)

Then('Kitchen should receive one order with status {string}', function (status) {
  expect(this.lastResponse.data[0].status).to.eql(status)
})

Then('Kitchen should see an order with status {string}', function (status) {
  expect(this.state.kitchen.orders[0].status).to.eql(status)
})
