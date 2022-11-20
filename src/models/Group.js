const { mongo } = require('./index')

const schema = new mongo.Schema({
    serverId: String,
    teamName: String,
    members: [String]
})

const Group = mongo.model('Group', schema)

module.exports = { Group }