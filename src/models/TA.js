const { mongo } = require('./index')

const schema = new mongo.Schema({
    serverId: String,
    userId: String
})

const TA = mongo.model('TA', schema)

module.exports = { TA }