module.exports = {
  client: 'postgresql',
  searchPath: 'public',
  connection: {
    database: 'tm_test',
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'root',
    port: process.env.DB_PORT || '15433',
  },
}
