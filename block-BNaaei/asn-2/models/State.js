var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var stateSchema = new Schema({
  name: { type: String, requied: true },
  country: { type: String, requied: true },
  population: { type: Number, default: 1000000 },
  area: { type: Number, default: 667143 },
  neighbouring_states: {
    type: [Schema.Types.ObjectId],
    ref: "State",
    requied: true,
  },
});
stateSchema.index({ area: 1, population: 1, name: 1 });
module.exports = mongoose.model("State", stateSchema);
