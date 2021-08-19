var express = require("express");
var router = express.Router();
var Book2 = require("../models/Book2");
var Category = require("../models/Category");

// list all categories
router.get("/", (req, res, next) => {
  Category.find({}, (err, categories) => {
    res.send(categories);
  });
});
//create a category
router.post("/", (req, res, next) => {
  req.body.name = req.body.name.toUpperCase();
  Category.create(req.body, (err, category) => {
    res.send(category);
  });
});
//edit
router.post("/edit/:id", (req, res, next) => {
  req.body.name = req.body.name.toUpperCase();
  let id = req.params.id;
  Category.findByIdAndUpdate(id, req.body, (err, category) => {
    res.json(category);
  });
});
//delete
router.post("/delete/:id", (req, res, next) => {
  let id = req.params.id;
  Category.findByIdAndDelete(id, req.body, (err, category) => {
    res.json(`${category} deleted success`);
  });
});
// list books by category
router.get("/findbycategory/:category", (req, res, next) => {
  var bookIds = [];
  let cat = req.params.category.toUpperCase();
  Category.find({}, (err, categories) => {
    categories.forEach((category) => {
      if (category.name == cat) {
        category.books.forEach((bookId) => {
          bookIds.push(`${bookId}`);
        });
      }
    });
    var bookList = [];
    Book2.find({}, (err, books) => {
      bookIds.forEach((bookId) => {
        books.forEach((book) => {
          if (book._id === bookId) {
            console.log(`hey`);
            bookList.push(book.name);
            console.log(bookList);
          }
        });
      });
    });
  });
});

module.exports = router;
