const { mongo } = require('./index')

const schema = new mongo.Schema({
    serverId: String,
    teamNumber: Number,
    members: [{ id: String }]
})

const Group = mongo.model('Group', schema)

module.exports = { Group }