require('dotenv').config()
const mongoose = require('mongoose')
const bot = require('./app')

const options = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
  autoIndex: true,
  poolSize: 10,
  bufferMaxEntries: 0,
}

const {
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
} = process.env

const dbConnectionURL = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.jhicz.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`

let dbConnect = () => {
  mongoose.connect(dbConnectionURL, options, (err) => {
    if (err) return console.log(err);
    console.log('DB connected');
  })
}


dbConnect()
