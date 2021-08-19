var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var categorySchema = new Schema({
  name: { type: String },
  books: { type: [Schema.Types.ObjectId], ref: "Book2" },
});
module.exports = mongoose.model("Category", categorySchema);
