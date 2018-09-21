const config = require('config')
let socket

const create = () => {
  const io = require('socket.io-client')
  socket = io(config.kitchen_api_host)
  return socket
}

module.exports = {
  create
}
