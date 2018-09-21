module.exports = {
  redis_host: process.env.REDISCLOUD_URL || 'localhost:16379',
  kitchen_api_host: `${process.env.KITCHEN_API_URL || 'http://localhost:4000'}`,
  store_location: {
    latitude: '27.691241',
    longitude: '-105.1718194',
  }
}
