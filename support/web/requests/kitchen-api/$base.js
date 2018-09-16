class Base {
  constructor(build) {
    this.uri = `${process.env.KITCHEN_API_URL || 'http://localhost:4000'}/api`
    this.apiServer = 'kitchen-api'
  }
}

module.exports = Base
