const { setWorldConstructor } = require('cucumber')
const apiRequester = require('./web/api_requester')
const kitchenSocket = require('./web/sockets/kitchen_socket_client')

class Context {
  constructor(params) {
    this.attach = params.attach
    this.lastResponse = {}
    this.lastPlacedOrder = {}
    this.currentRequest = {}
    this.kitchenSockets = []
    this.state = {
      kitchen: {
        orders: []
      }
    }
    this.initSocketLocks = {
      placedOrder: 0,
    }
    this.socketLocks = this.initSocketLocks
  }

  async send(request) {
    this._logRequestInfo(request)

    this.lastResponse = await apiRequester.send(request)

    this._logResponseInfo(this.lastResponse)

    if (this.lastResponse.success && request.path === 'orders/place') {
      this.lastPlacedOrder = this.lastResponse.data
    }

    return this.lastResponse
  }

  async awaitOn(func) {
    let tries = 10
    while (!func() && tries-- > 0) {
      await this.sleep(200)
    }
  }

  async awaitForSocket(lock) {
    const currentLock = this.socketLocks[lock]
    this.socketLocks[lock]++
    await this.awaitOn(() => this.socketLocks[lock] <= currentLock)
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  _logRequestInfo(request) {
    this.attach(`${request.method} /${request.path} (${request.apiServer})`)
    this.attach(
      `request
${JSON.stringify(request.payload)}`,
      'text/plain',
    )
  }

  _logResponseInfo(response) {
    this.attach(
      `response
${JSON.stringify(response)}`,
      'text/plain',
    )
  }

  createKitchenSocket(location) {
    const socket = kitchenSocket.create(location)
    this.kitchenSockets.push(socket)
    this._setKitchenSocketListeners(socket)
    return socket
  }

  _setKitchenSocketListeners(socket) {
    socket.on('placed_order', order => {
      this._logSocketMessage('kitchen-api', 'placed_order', order)
      this.state.kitchen.orders.push(order)
      this.socketLocks.placedOrder--
    })
  }


  _logSocketMessage(endpoint, channel, data) {
    this.attach(`${endpoint} ${channel}`)
    this.attach(
      `socket response
${JSON.stringify(data)}`,
      'text/plain',
    )
  }
}

setWorldConstructor(Context)
