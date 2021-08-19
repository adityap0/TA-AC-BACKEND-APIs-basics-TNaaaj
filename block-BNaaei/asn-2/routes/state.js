var express = require("express");
var router = express.Router();
var Country = require("../models/Country");
var State = require("../models/State");

/* GET country listing. */
router.get("/", function (req, res, next) {
  State.find({}, (err, states) => {
    res.json(states);
  });
});
router.post("/", function (req, res, next) {
  req.body.name = req.body.name.toUpperCase();
  req.body.country = req.body.country.toUpperCase();
  req.body.neighbours = req.body.neighbours.split(",");
  req.body.neighbours = req.body.neighbours.map((country) => {
    return country.trim().toUpperCase();
  });
  let neighbourId = [];
  State.find({}, (err, states) => {
    states.forEach((state) => {
      req.body.neighbours.forEach((neighbour) => {
        if (neighbour == state.name) {
          neighbourId.push(state._id);
        }
      });
    });
    req.body.neighbouring_states = neighbourId;
    State.create(req.body, (err, state) => {
      if (err) return next(err);
      var stateId = state._id;
      neighbourId.forEach((id) => {
        State.findByIdAndUpdate(
          id,
          {
            $push: { neighbouring_states: stateId },
          },
          (err, neighbour) => {}
        );
      });
      //Adding state id to the country
      Country.find({}, (err, countries) => {
        countries.forEach((country) => {
          var cid = country._id;
          var sid = state._id;
          if (country.name == state.country) {
            Country.findByIdAndUpdate(
              cid,
              { $push: { states: sid } },
              (err, updatedCountry) => {}
            );
          }
        });
      });
      res.json(state);
    });
  });
});
// 5. list all states for a country in ascending/descending order by name
router.get("/sortbyname", function (req, res, next) {
  State.aggregate([{ $sort: { name: -1 } }], (err, states) => {
    res.json(states);
  });
});
// list all states in an ascending order of their population
router.get("/sortbypop", function (req, res, next) {
  State.aggregate([{ $sort: { population: 1 } }], (err, states) => {
    res.json(states);
  });
});
// for a particular state, list all neighbouring states
router.get("/neighbours/:id", function (req, res, next) {
  let id = req.params.id;

  State.findById(id)
    .populate("neighbouring_states")
    .exec((err, state) => {
      var neighbourState = [];
      state.neighbouring_states.forEach((neighbour) => {
        neighbourState.push(neighbour.name);
      });
      res.json(neighbourState);
    });
});

module.exports = router;
