const Base = require('../$base')

class Request extends Base {
  constructor(build) {
    super()
    this.code = build.code
    this.newJamon = build.newJamon
    this.newLomo = build.newLomo
    this.newEspecial = build.newEspecial
    this.newRefrescos = build.newRefrescos
    this.newNotes = build.newNotes
  }

  get method() {
    return 'POST'
  }

  get path() {
    return 'orders/update'
  }

  get payload() {
    return {
      code: this.code,
      newJamon: this.newJamon,
      newLomo: this.newLomo,
      newEspecial: this.newEspecial,
      newRefrescos: this.newRefrescos,
      newNotes: this.newNotes,
    }
  }

  static get Builder() {
    class Builder {
      constructor() {
        this.code = ''
        this.newJamon = undefined
        this.newLomo = undefined
        this.newEspecial = undefined
        this.newRefrescos = undefined
        this.newNotes = undefined
      }

      withCode(code) {
        this.code = code
        return this
      }

      withNewJamon(newJamon) {
        this.newJamon = newJamon
        return this
      }

      withNewLomo(newLomo) {
        this.newLomo = newLomo
        return this
      }

      withNewEspecial(newEspecial) {
        this.newEspecial = newEspecial
        return this
      }

      withNewRefrescos(newRefrescos) {
        this.newRefrescos = newRefrescos
        return this
      }

      withNewNotes(newNotes) {
        this.newNotes = newNotes
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
