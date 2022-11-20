const mongoose = require('mongoose')

const { ObjectId: ObjectIdSchema } = mongoose.Schema
const { ObjectId: ObjectIdType } = mongoose.Types

const mongoURI = 'mongo'
const mongoDatabaseName = 'discord'

mongoose.connect(`mongodb://${mongoURI}/${mongoDatabaseName}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

module.exports = { mongo: mongoose, ObjectIdSchema, ObjectIdType }
