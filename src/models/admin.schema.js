const mongoose = require('mongoose')
const { Schema, model } = mongoose

const adminSchema = new Schema({
  tg_id: String,
});

module.exports = model('Admin', adminSchema)