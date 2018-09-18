const R = require('ramda')
const { Given, When, Then } = require('cucumber')
const GetOrdersRequest = require('support/web/requests/kitchen-api/orders/list')
const PlaceOrderRequest = require('support/web/requests/order-taker-api/orders/place')
const { expect } = require('chai')

Given('Order Taker places an order with {int} jamon', async function(jamon) {
  const request = new PlaceOrderRequest.Builder().withJamon(jamon).build()
  await this.send(request)
})

When('Kitchen sends request to get last orders', async function() {
  const request = new GetOrdersRequest.Builder().build()
  await this.send(request)
})

Then(
  'Kitchen should receive one order with {int} jamon, {int} lomo, {int} especial and {int} refrescos',
  function(jamon, lomo, especial, refrescos) {
    expect(this.lastResponse.data.length).to.eql(1)
    expect(this.lastResponse.data[0].jamon).to.eql(jamon)
    expect(this.lastResponse.data[0].lomo).to.eql(lomo)
    expect(this.lastResponse.data[0].especial).to.eql(especial)
    expect(this.lastResponse.data[0].refrescos).to.eql(refrescos)
  },
)
