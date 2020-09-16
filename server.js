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
  DB_HOST,
  DB_NAME,
  DB_PORT,
} = process.env

const dbConnectionURL = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`

let dbConnect = () => {
  mongoose.connect(dbConnectionURL, options, (err) => {
    if (err) return console.log(err);
    console.log('DB connected');
  })
}
dbConnect()
bot.launch()