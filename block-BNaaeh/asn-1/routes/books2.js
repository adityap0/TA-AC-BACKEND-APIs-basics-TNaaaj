var express = require("express");
var router = express.Router();
var Book2 = require("../models/Book2");
var Comment = require("../models/Comment");
var Category = require("../models/Category");

//POST /api/books - create a book
router.post("/", (req, res, next) => {
  req.body.categories = req.body.categories.split(",");
  req.body.categories = req.body.categories.map((category) => {
    return category.trim().toUpperCase();
  });
  var bookCategoryArr = [];
  Category.find({}, (err, categories) => {
    req.body.categories.forEach((bookCategory) => {
      categories.forEach((category) => {
        if (category.name == bookCategory) {
          bookCategoryArr.push(`${category._id}`);
        }
      });
    });
    req.body.categories = bookCategoryArr;
    Book2.create(req.body, (err, book) => {
      book.categories.forEach((categoryId) => {
        var bookId = book._id;
        Category.findByIdAndUpdate(
          categoryId,
          { $push: { books: bookId } },
          (err, category) => {}
        );
      });
      res.json(book);
    });
  });
  // Category.find({}, (err, categories) => {
  //   console.log(categories);
  // });
});

router.get("/", function (req, res, next) {
  Book2.find({})
    .populate("comments categories")
    .exec((err, books) => {
      res.status(200).json(books);
    });
});
// GET /api/books/:id - get single book
router.get("/:id", function (req, res, next) {
  let id = req.params.id;
  Book2.findById(id)
    .populate("comments")
    .exec((err, book) => {
      res.json(book);
    });
});
//Update Book
router.put("/:id", function (req, res, next) {
  let id = req.params.id;
  Book2.findByIdAndUpdate(id, req.body, (err, book) => {
    res.send(`${book} updated successfully!`);
  });
});
// DELETE /api/books/:id - delete a book
router.delete("/:id", function (req, res, next) {
  let id = req.params.id;
  Book2.findByIdAndDelete(id, (err, book) => {
    res.send(`${book} deleted successfully!`);
  });
});

//Comments

//Add New Comment
router.post("/:id/comments/new", function (req, res, next) {
  let id = req.params.id;
  req.body.bookId = id;
  Comment.create(req.body, (err, comment) => {
    let cid = comment._id;
    Book2.findByIdAndUpdate(id, { $push: { comments: cid } }, (err, book) => {
      res.send(`${book} this is the added book`);
    });
  });
});
router.post("/:id/comments/:cid/edit", function (req, res, next) {
  let id = req.params.id;
  req.body.bookId = id;
  let cid = req.params.cid;
  console.log(req.body);
  Comment.findByIdAndUpdate(cid, req.body, (err, comment) => {
    res.json(comment);
  });
});
router.get("/:id/comments/:cid/delete", function (req, res, next) {
  let id = req.params.id;
  let cid = req.params.cid;
  Comment.findByIdAndDelete(cid, (err, comment) => {
    Book2.findByIdAndUpdate(id, { $pull: { comments: cid } }, (err, book) => {
      res.json(book);
    });
  });
});

//
module.exports = router;
