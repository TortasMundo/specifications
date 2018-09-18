const Base = require('../$base')

class Request extends Base {
  constructor(build) {
    super()
    this.jamon = build.jamon
    this.lomo = build.lomo
    this.especial = build.especial
    this.refrescos = build.refrescos
  }

  get method() {
    return 'POST'
  }

  get path() {
    return 'orders/place'
  }

  get payload() {
    return {
      jamon: this.jamon,
      lomo: this.lomo,
      especial: this.especial,
      refrescos: this.refrescos,
    }
  }

  static get Builder() {
    class Builder {
      constructor() {
        this.jamon = 0
        this.lomo = 0
        this.especial = 0
        this.refrescos = 0
      }

      withJamon(jamon) {
        this.jamon = jamon
      }

      withLomo(lomo) {
        this.lomo = lomo
      }

      withEspecial(especial) {
        this.especial = especial
      }

      withRefrescos(refrescos) {
        this.refrescos = refrescos
      }

      build() {
        return new Request(this)
      }
    }

    return Builder
  }
}

module.exports = Request
