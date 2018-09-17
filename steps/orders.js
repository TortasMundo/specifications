const R = require('ramda')
const { Given, When, Then } = require('cucumber')
const GetOrdersRequest = require('support/web/requests/kitchen-api/orders/list')
const { expect } = require('chai')

Given('Order Taker places an order', async function () {

});

When('Kitchen sends request to get last orders', async function() {
  const request = new GetOrdersRequest.Builder().build()
  await this.send(request)
})
