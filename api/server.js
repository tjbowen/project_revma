const express = require('express')
const app = express()
const logger = require('morgan')
const bodyParser = require('body-parser')
const { Client } = require('pg')
const cors = require('cors')
const uuid = require('uuid/v1')

const client = new Client({
    host: 'pgdb.accsoftwarebootcamp.com',
    port: 5432,
    database: 'accsoftwarebootcamp',
    user: 'acc',
    password: 'accrocks'
})

const port = process.env.PORT || 5000

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

client.connect(err => {
    if(err){
        console.log("DB connection error is ", err.stack)
    } 
    console.log(`You are connected to the ${client.database} DB`)
})

app.post('/streams_backend', (req, res) => {
    let newTitle = req.body.title 
    let newDescription = req.body.description 
    let newId = uuid()
    if(!newTitle){
        res.status(411).send({ message: "No title entered"})
    }
    if(!newDescription){
        res.status(411).send({ message: "No description entered"})
    }
    let query = `INSERT INTO streams (title, description, id)
                 VALUES ('${newTitle}', '${newDescription}', '${newId}')
                 RETURNING id`;
    client.query(query, (err, result) => {
        if(err){
            console.log("err.stack is ", err.stack)
            res.end()
        }
        console.log("results are ", result)
        res.send(result)
    })
})

app.listen(port, () => {console.log(`You are on port ${port}`)})