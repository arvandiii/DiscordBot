const { mongo } = require('./index')

const schema = new mongo.Schema({
    serverId: String,
    role: String,
    code: String,
    isUsed: { type: Boolean, default: false }
})

const RoleCode = mongo.model('RoleCode', schema)

module.exports = { RoleCode }