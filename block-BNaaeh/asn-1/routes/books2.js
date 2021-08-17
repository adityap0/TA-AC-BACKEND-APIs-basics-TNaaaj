var express = require("express");
var router = express.Router();
var Book2 = require("../models/Book2");
var Comment = require("../models/Comment");

//POST /api/books - create a book
router.post("/new", (req, res, next) => {
  Book2.create(req.body, (err, book) => {
    res.send(`${book} created successfully!`);
  });
});

router.get("/", function (req, res, next) {
  Book2.find({})
    .populate("comments")
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
