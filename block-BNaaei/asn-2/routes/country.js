var express = require("express");
var router = express.Router();
var Country = require("../models/Country");

/* GET country listing. */
router.get("/", function (req, res, next) {
  Country.find({})
    .populate("states")
    .exec((err, countries) => {
      res.json(countries);
    });
});
/* CREATE country. */
router.post("/", function (req, res, next) {
  req.body.ethnicity = req.body.ethnicity.split(",");
  req.body.ethnicity = req.body.ethnicity.map((state) => {
    return state.trim().toUpperCase();
  });
  req.body.neighbours = req.body.neighbours.split(",");
  req.body.neighbours = req.body.neighbours.map((country) => {
    return country.trim().toUpperCase();
  });
  req.body.name = req.body.name.toUpperCase();

  //Adding Neighbours from the Db
  let neighbourId = [];
  Country.find({}, (err, countries) => {
    countries.forEach((country) => {
      req.body.neighbours.forEach((neighbour) => {
        if (neighbour == country.name) {
          neighbourId.push(country._id);
        }
      });
    });
    req.body.neighbouring_countires = neighbourId;
    Country.create(req.body, (err, country) => {
      var countryId = country._id;
      if (err) return next(err);
      neighbourId.forEach((id) => {
        Country.findByIdAndUpdate(
          id,
          {
            $push: { neighbouring_countires: countryId },
          },
          (err, neighbour) => {
            console.log(neighbour);
          }
        );
      });
      res.json(country);
    });
  });
});

//Sort COUNTRY by population (Ascending Order)
router.get("/sortbypop", function (req, res, next) {
  Country.find({})
    .sort({ population: 1 })
    .exec((err, countries) => {
      console.log(countries);
      res.json(countries);
    });
});
//Sort COUNTRY by population (Ascending Order)
router.get("/sortbyname", function (req, res, next) {
  Country.find({})
    .sort({ name: 1 })
    .exec((err, countries) => {
      console.log(countries);
      res.json(countries);
    });
});

//UDATE COUNTRY
router.post("/edit/:id", function (req, res, next) {
  let id = req.params.id;
  req.body.ethnicity = req.body.ethnicity.split(",");
  req.body.ethnicity = req.body.ethnicity.map((state) => {
    return state.trim().toUpperCase();
  });
  Country.findByIdAndUpdate(id, req.body, (err, country) => {
    if (err) return next(err);
    res.json(country);
  });
});
//DELETE COUNTRY
router.get("/delete/:id", function (req, res, next) {
  let id = req.params.id;
  Country.findByIdAndDelete(id, (err, country) => {
    if (err) return next(err);
    var deleteId = country._id;
    country.neighbouring_countires.forEach((neighbourId) => {
      Country.findByIdAndUpdate(
        neighbourId,
        {
          $pull: { neighbouring_countires: deleteId },
        },
        (err, country) => {}
      );
    });
    res.send(`${country} is now deleted Forever`);
  });
});
// for a particular country, list all neighbouring countires
router.get("/neighbours/:id", function (req, res, next) {
  let id = req.params.id;
  Country.findById(id)
    .populate("neighbouring_countires")
    .exec((err, country) => {
      let ncountry = [];
      country.neighbouring_countires.forEach((nc) => {
        ncountry.push(nc.name);
      });
      res.json(ncountry);
    });
});
// list all religions present in entire country dataaset.
router.get("/religions", function (req, res, next) {
  Country.find({}, (err, countries) => {
    var rel = [];
    countries.forEach((country) => {
      country.ethnicity.forEach((ethics) => {
        rel.push(ethics);
      });
    });
    rel = rel.filter(function (item, id) {
      return rel.indexOf(item) === id;
    });
    res.json(rel);
  });
});
module.exports = router;
