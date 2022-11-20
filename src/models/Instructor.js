const { mongo } = require('./index')

const schema = new mongo.Schema({
    serverId: String,
    userId: String
})

const Instructor = mongo.model('Instructor', schema)

module.exports = { Instructor }