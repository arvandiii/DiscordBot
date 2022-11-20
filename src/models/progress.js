const { mongo } = require('./index')

const schema = new mongo.Schema({
    serverId: String,
    userId: String,
    username: String,
    phase: String,
    groupTeamName: String,
    comment: String,
    mins: Number
})

const Progress = mongo.model('Progress', schema)

module.exports = { Progress }