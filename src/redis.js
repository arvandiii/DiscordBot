const Redis = require('ioredis')

const redisHost = '127.0.0.1:6379'
const redis = new Redis(redisHost)

module.exports = { redis }
