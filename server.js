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

const BOT_TOKEN = process.env.BOT_TOKEN || '';
const PORT = process.env.PORT || 3000;
const URL = process.env.URL || '';

bot.telegram.setWebhook(`${URL}/bot${BOT_TOKEN}`);
bot.startWebhook(`/bot${BOT_TOKEN}`, null, PORT)