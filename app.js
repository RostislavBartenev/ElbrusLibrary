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
const Admin = require('./src/models/admin.schema')


bot.use(Telegraf.log())

const stage = new Stage([captionScene, linkScene, tagScene, photoScene, bookScene])


bot.use(session())
bot.use(stage.middleware())


bot.start((ctx) => ctx.reply('Здравствуйте, что бы найти книгу напишите /find и ключевое слово книги! \n Например: /find javascript или /find что бы увидеть все доступные книги'))

bot.command('find', async  (ctx) => {
  let msg = ctx.message.text
  let msgArray = msg.split(' ')
  msgArray.shift()
  msg = msgArray.join(' ')

  let books, regex

  console.log(msg)

  if (msg) {

    regex = new RegExp(`${msg}`, 'i')
    books = await Book.find({caption: regex}).exec()

    if (books.length < 1) {
       books = await Book.find({tag: {$in: regex}}).exec()
    }

  } else {
       books = await Book.find().limit(10).exec()
  }

  try {
    console.log(books)
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
  let userId = ctx.message.chat.id
  let userAdmin = await Admin.findOne({tg_id: userId})

  if (userId === +process.env.ADMIN || userAdmin) {
    ctx.scene.enter('caption')
  } else {
    ctx.reply('У вас не достаточно прав')
  }

})

bot.command('addAdmin', async (ctx) => {
  let userId = ctx.message.chat.id
  let userAdmin = await Admin.findOne({tg_id: userId})

  if (userId === +process.env.ADMIN || userAdmin) {
    let msg = ctx.message.text
    let msgArray = msg.split(' ')
    msgArray.shift()
    msg = msgArray.join(' ')

    console.log(msg, typeof msg)

    let isAdmin = await Admin.findOne({tg_id: msg})

    if (isAdmin) {
      ctx.reply('Он уже является администратором')
    } else {
      if (msg) {
        let newAdmin = new Admin({tg_id: msg})
        newAdmin.save()
        ctx.reply('Админ добавлен')
      } else {
        ctx.reply('Введите ID пользователя которого хотите сделать админом')
      }

    }
  } else {
    ctx.reply('У вас не достаточно прав')
  }
})

module.exports = bot