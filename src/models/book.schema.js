const mongoose = require('mongoose')
const { Schema, model } = mongoose

const bookSchema = new Schema({
  caption: String,
  link: String,
  tag: Array,
  media: {type: String, default: 'https://i.pinimg.com/originals/8a/eb/d8/8aebd875fbddd22bf3971c3a7159bdc7.png'},
});

module.exports = model('Book', bookSchema)