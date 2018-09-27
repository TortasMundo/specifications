const Base = require('../$base')

class Request extends Base {
  constructor(build) {
    super()
    this.code = build.code
    this.newStatus = build.newStatus
  }
  get method() {
    return 'POST'
  }
  get path() {
    return 'orders/update_status'
  }
  get payload() {
    return {
      code: this.code,
      newStatus: this.newStatus
    }
  }
  static get Builder() {
    class Builder {
      constructor() {
        this.code = ''
        this.newStatus = ''
      }
      withCode(code) {
        this.code = code
        return this
      }
      withNewStatus(newStatus) {
        this.newStatus = newStatus
        return this
      }
      build() {
        return new Request(this)
      }
    }
    return Builder
  }
}

module.exports = Request
