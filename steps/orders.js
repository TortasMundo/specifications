const R = require('ramda')
const config = require('config')
const { Given, When, Then } = require('cucumber')
const KitchenGetOrdersRequest = require('support/web/requests/kitchen-api/orders/list')
const OrderTakerGetOrdersRequest = require('support/web/requests/order-taker-api/orders/list')
const UpdateOrderStatusRequest = require('support/web/requests/kitchen-api/orders/update_status')
const PlaceOrderRequest = require('support/web/requests/order-taker-api/orders/place')
const UpdateOrderQuantitiesRequest = require('support/web/requests/order-taker-api/orders/update_quantities')
const { expect } = require('chai')
const Knex = require('knex')
const KnexFile = require('../support/knexfile')
const moment = require('moment-timezone')
const uuid = require('uuid')

Given('there was an order registered yesterday', async function() {
  const knex = Knex(KnexFile)
  await knex('orders').insert({
    customer_code: '0',
    code: uuid(),
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
    ordered_at: moment().tz('America/Chihuahua').subtract(1, 'days'),
  })
  await knex.destroy()
})

Given('Order Taker places an order', async function() {
  const request = new PlaceOrderRequest.Builder()
    .withLomo(1)
    .build()
  await this.send(request)
})

Given('Order Taker places an order with zero quantities', async function() {
  const request = new PlaceOrderRequest.Builder().build()
  await this.send(request)
})


Given('Order Taker places an order with {int} jamon', async function(jamon) {
  const request = new PlaceOrderRequest.Builder().withJamon(jamon).build()
  await this.send(request)
})

Given('Kitchen subscribes to socket to get new orders', async function() {
  const socket = this.createKitchenSocket()
  socket.emit('subscribe_for_order_placements', config.store_location)
  await this.sleep(300)
})

Given('Order Taker changes last order quantities to {int} jamon, {int} lomo, {int} especial, {int} refrescos',
  async function(jamon, lomo, especial, refrescos) {
  const request = new UpdateOrderQuantitiesRequest.Builder()
    .withCode(this.lastPlacedOrder.code)
    .withNewJamon(jamon)
    .withNewLomo(lomo)
    .withNewEspecial(especial)
    .withNewRefrescos(refrescos)
    .build()
  await this.send(request)
})

When('Order Taker places an order with {int} lomo, {int} especial', async function(lomo, especial) {
  const request = new PlaceOrderRequest.Builder()
    .withLomo(lomo)
    .withEspecial(especial)
    .build()
  await this.send(request)
})

When('Kitchen sends request to get last orders', async function() {
  const request = new KitchenGetOrdersRequest.Builder().build()
  await this.send(request)
})

When('Order Taker sends request to get last orders', async function() {
  const request = new OrderTakerGetOrdersRequest.Builder().build()
  await this.send(request)
})

When('Kitchen updates last order to {string}', async function(status) {
  const lastOrderCode = this.state.kitchen.orders[0].code
  const request = new UpdateOrderStatusRequest.Builder()
    .withCode(lastOrderCode)
    .withNewStatus(status)
    .build()

  await this.send(request)
})

Then('Kitchen should receive one order', function() {
  expect(this.lastResponse.data.length).to.eql(1)
})

Then('Order Taker should receive one order', function() {
  expect(this.lastResponse.data.length).to.eql(1)
})

Then(
  'Kitchen should receive an order with {int} jamon, {int} lomo, {int} especial and {int} refrescos',
  function(jamon, lomo, especial, refrescos) {
    expect(this.lastResponse.data.length).to.eql(1)
    expect(this.lastResponse.data[0].jamon_quantity).to.eql(jamon.toString())
    expect(this.lastResponse.data[0].lomo_quantity).to.eql(lomo.toString())
    expect(this.lastResponse.data[0].especial_quantity).to.eql(especial.toString())
    expect(this.lastResponse.data[0].refrescos_quantity).to.eql(refrescos.toString())
  },
)

Then(
  'Kitchen should see an order with {int} jamon, {int} lomo, {int} especial and {int} refrescos',
  async function(jamon, lomo, especial, refrescos) {
    await this.awaitForSocket('placedOrder')
    expect(this.state.kitchen.orders.length).to.eql(1)
    expect(this.state.kitchen.orders[0].jamon_quantity).to.eql(jamon)
    expect(this.state.kitchen.orders[0].lomo_quantity).to.eql(lomo)
    expect(this.state.kitchen.orders[0].especial_quantity).to.eql(especial)
    expect(this.state.kitchen.orders[0].refrescos_quantity).to.eql(refrescos)
  },
)

Then('Kitchen should receive one order with status {string}', function(status) {
  expect(this.lastResponse.data[0].status).to.eql(status)
})

Then('Kitchen should see an order with status {string}', async function(status) {
  await this.awaitForSocket('placedOrder')
  expect(this.state.kitchen.orders[0].status).to.eql(status)
})
