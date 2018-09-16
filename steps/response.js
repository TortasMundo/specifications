const { Given, When, Then } = require('cucumber')
const { expect } = require('chai')

Then('Kitchen should receive successful response', function () {
  expect(this.lastResponse.success, JSON.stringify(this.lastResponse).substring(0,1000)).to.be.true
})