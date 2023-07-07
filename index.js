const express = require('express')
const mongoose = require('mongoose')
const app = express()
const dotenv = require('dotenv')
dotenv.config()
const {PORT, DB_CONNECTION } = process.env

const route = require('./src/routes/route')
const multer = require('multer')


app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(multer().any())


mongoose.connect(DB_CONNECTION, {
    useNewUrlParser:true
})
.then(()=> console.log("MongoDb database connected....."))
.catch((error)=> console.log(error))

app.use('/', route)

app.listen(PORT, function(){
    console.log('Express app is running on the server ' + PORT)
})