class Base {
  constructor(build) {
    this.uri = `${process.env.ORDER_TAKER_API_URL || 'http://localhost:4001'}`
    this.apiServer = 'order-taker-api'
  }
}

module.exports = Base
