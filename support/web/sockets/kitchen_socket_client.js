const config = require('config')
let socket

const create = () => {
  const io = require('socket.io-client', { query: "is-test=true" })
  socket = io(config.kitchen_api_host)
  return socket
}

module.exports = {
  create
}
