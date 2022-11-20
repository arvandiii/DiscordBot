const { mongo } = require('./index')

const schema = new mongo.Schema({
    name: String,
    id: String,
    channels: [{ name: String, id: String }]
})

const Server = mongo.model('Server', schema)

module.exports = { Server }
