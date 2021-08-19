var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var countrySchema = new Schema({
  name: { type: String, requied: true },
  states: { type: [Schema.Types.ObjectId], ref: "State" },
  continent: { type: String, default: "Asia" },
  population: { type: Number, default: 1000000 },
  ethnicity: { type: [String] },
  neighbouring_countires: {
    type: [Schema.Types.ObjectId],
    ref: "Country",
  },
  area: { type: Number, default: 667143 },
});
countrySchema.index({ area: 1, population: 1, name: 1 });
module.exports = mongoose.model("Country", countrySchema);
