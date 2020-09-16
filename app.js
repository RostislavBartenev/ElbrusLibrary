require('dotenv').config()
const { Telegraf } = require('telegraf')
const bot = new Telegraf(process.env.BOT_TOKEN)

const {
  Extra,
  Markup,
  Stage,
  session,
} = Telegraf

const SceneGenerator = require('./src/scenes/addBook.scene')
const curScene = new SceneGenerator()

const captionScene = curScene.GenCaptionScene()
const linkScene = curScene.GenLinkScene()
const tagScene = curScene.GenTagScene()
const photoScene = curScene.GenPhotoScene()
const bookScene = curScene.GenBookScene()

const Book = require('./src/models/book.schema')


bot.use(Telegraf.log())

const stage = new Stage([captionScene, linkScene, tagScene, photoScene, bookScene])


bot.use(session())
bot.use(stage.middleware())


bot.start((ctx) => ctx.reply('Здравствуйте, что бы начать напишите /find и ключевое слово книги! \n Например: /find javascript'))

bot.command('find', async  (ctx) => {
  let msg = ctx.message.text
  let msgArray = msg.split(' ')
  msgArray.shift()
  msg = msgArray.join(' ')
  let regex = new RegExp(`${msg}`, 'i')

  let books = await Book.find({caption: regex}).exec()
  if (books.length < 1) {
    books = await Book.find({tag: { $in: regex }}).exec()
  }

  try {
    let group = []
    for (let i = 0; i < books.length; i++) {
      let photo = books[i].media
      group.push({
        caption: `Название: ${books[i].caption}  \n \nСсылка на книгу: ${books[i].link} \n`,
        media: photo,
        type: 'photo',
      })
    }
    await ctx.replyWithMediaGroup(group)
  } catch (error) {
    console.log(error)
  }

})

bot.command('add', async (ctx) => {
  ctx.scene.enter('caption')
})

bot.command('lib', (ctx) => {
 ctx.telegram.sendMessage(ctx.chat.id, 'В какой разделы вы хотите добавить книгу?', {
   reply_markup: {
     inline_keyboard: [
       [{text: 'JavaScript', callback_data:'JS'}],
       ]
   }
 })
})

bot.action('JS', (ctx) => {
  ctx.deleteMessage()
  ctx.reply('JS')
})

module.exports = bot