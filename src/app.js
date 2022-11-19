const express = require('express')
const app = express()
const bodyParser = require('body-parser');

const { createServer } = require('./bot')

const port = 3000

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/init', async (req, res) => {
    console.log('receiving data ...');
    console.log('body is ', req.body);
    const result = await createServer(req.body)
    res.send(result);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})