const Scene = require('telegraf/scenes/base')
const Book = require('../models/book.schema')

class SceneGenerator {
  GenCaptionScene() {
    const caption = new Scene('caption')
    caption.enter(async (ctx) => {
      await ctx.reply('Введите название книги')
    })
    caption.on('text', async (ctx) => {
      this.caption = ctx.message.text.trim()
      if (caption !== '') {
        await ctx.scene.enter('link')
      } else {
        await ctx.reply('Введите название книги')
        await ctx.scene.reenter()
      }
    })
    caption.on('message', (ctx) => ctx.reply('Введите только название'))
    return caption
  }

  GenLinkScene() {
    const link = new Scene('link')
    link.enter(async (ctx) => {
      await ctx.reply('Вставьте ссылку на книгу')
    })
    link.on('text', async (ctx) => {
      this.link = ctx.message.text.trim()
      if (link !== '') {
        await ctx.scene.enter('tag')
      } else {
        await ctx.reply('Вставьте ссылку')
        await ctx.scene.reenter()
      }
    })
    link.on('message', (ctx) => ctx.reply('Введите только название'))
    return link
  }

  GenTagScene() {
    const tag = new Scene('tag')
    tag.enter(async (ctx) => {
      await ctx.reply('Укажите тэги книги через запятую')
    })
    tag.on('text', async (ctx) => {
      this.tag = ctx.message.text.trim().split(', ')
      if (tag !== '') {
        await ctx.scene.enter('photo')
      } else {
        await ctx.reply('Напишите тэг')
        await ctx.scene.reenter()
      }
    })
    tag.on('message', (ctx) => ctx.reply('Напишите тэг'))
    return tag
  }

  GenPhotoScene() {
    const photo = new Scene('photo')
    photo.enter(async (ctx) => {
      await ctx.reply('Отправьте фото для обложки')
    })
    photo.on('photo', async (ctx) => {
      this.photo = ctx.message.photo[0].file_id
      await ctx.scene.enter('book')
    })
    photo.on('message', (ctx) => ctx.reply('Вставьте ссылку на фото'))
    return photo
  }

  GenBookScene() {
    const book = new Scene('book')
    book.enter(async (ctx) => {
      try {
        const bookItem = new Book({caption: this.caption, link: this.link, tag: this.tag, media: this.photo})
        await bookItem.save()
        await ctx.reply('Книга сохранилась')
        await ctx.scene.leave()
      } catch (error) {
        await ctx.reply('Что-то пошло не так')
        await ctx.scene.leave()
      }

    })
    return book
  }
}

module.exports = SceneGenerator