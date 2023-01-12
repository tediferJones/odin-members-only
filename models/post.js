const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema ({
  message: { type: String, maxLength: 500, required: true },
  author: { type: String, required: true},
  date: { type: String, required: true }
})

module.exports = mongoose.model('Post', PostSchema);