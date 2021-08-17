var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Comment = require("../models/Comment");

var book2Schema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  bio: { type: String, required: true },
  price: { type: Number, default: 400 },
  comments: { type: [Schema.Types.ObjectId], ref: "Comment" },
});

module.exports = mongoose.model("Book2", book2Schema);
