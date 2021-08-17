var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var bookSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  bio: { type: String, required: true },
  price: { type: Number, default: 400 },
});

module.exports = mongoose.model("Book", bookSchema);
