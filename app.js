require('dotenv').config()
const { Telegraf } = require('telegraf')
const bot = new Telegraf(process.env.BOT_TOKEN)
const request = require('request');

bot.use(Telegraf.log())

bot.start((ctx) => ctx.reply('Здравствуйте, что бы начать напишите /find и ключевое слово книги! \n Пример: /find javascript'))

bot.command('find', (ctx) => {
  let msg = ctx.message.text
  let msgArray = msg.split(' ')
  msgArray.shift()
  msg = msgArray.join(' ').toLowerCase()

  request(`https://www.googleapis.com/books/v1/volumes?q=${msg}`, (error, res, body) => {
    if (error) res.status(500).send({message: error});
    try {
      body = JSON.parse(body)
      let group = []
      for (let i = 0; i < body.items.length; i++) {
        let photo
        if (body.items[i].volumeInfo && "imageLinks" in body.items[i].volumeInfo) {
          photo = body.items[i].volumeInfo?.imageLinks.thumbnail
          group.push({
            caption: `Название: ${body.items[i].volumeInfo.title} \n \nСсылка на книгу: ${body.items[i].volumeInfo.previewLink} \n`,
            media: photo,
            type: 'photo',
          })
        } else {
          photo = ''
        }
      }
      ctx.replyWithMediaGroup(group)
    } catch (error) {
      console.log(error)
    }
  })
})

module.exports = bot