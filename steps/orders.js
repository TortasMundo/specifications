const R = require('ramda')
const { Given, When, Then } = require('cucumber')
const GetOrdersRequest = require('support/web/requests/kitchen-api/orders/list')
const PlaceOrderRequest = require('support/web/requests/order-taker-api/orders/place')
const { expect } = require('chai')

Given('Order Taker places an order with {int} jamon', async function(jamon) {
  const request = new PlaceOrderRequest.Builder().withJamon(jamon).build()
  await this.send(request)
})

Given('Kitchen subscribes to socket to get new orders', async function() {
  const socket = this.createKitchenSocket()
  socket.emit('subscribe_for_placed_orders', {})
  await this.sleep(300)
})

When('Order Taker places an order with {int} lomo, {int} especial', async function(lomo, especial) {
  const request = new PlaceOrderRequest.Builder()
    .withLomo(lomo)
    .withEspecial(especial)
    .build()
  await this.send(request)
})

When('Kitchen sends request to get last orders', async function() {
  const request = new GetOrdersRequest.Builder().build()
  await this.send(request)
})

Then(
  'Kitchen should receive one order with {string} jamon, {string} lomo, {string} especial and {string} refrescos',
  function(jamon, lomo, especial, refrescos) {
    expect(this.lastResponse.data.length).to.eql(1)
    expect(this.lastResponse.data[0].jamonQuantity).to.eql(jamon)
    expect(this.lastResponse.data[0].lomoQuantity).to.eql(lomo)
    expect(this.lastResponse.data[0].especialQuantity).to.eql(especial)
    expect(this.lastResponse.data[0].refrescosQuantity).to.eql(refrescos)
  },
)
