var express = require("express");
var router = express.Router();
var Book = require("../models/Book");

//POST /api/books - create a book
router.post("/", (req, res, next) => {
  Book.create(req.body, (err, book) => {
    res.send(`${book} created successfully!`);
  });
});
//GET /api/books - list of all books
router.get("/", function (req, res, next) {
  Book.find({}, (err, books) => {
    res.status(200).json(books);
  });
});
// GET /api/books/:id - get single book
router.get("/:id", function (req, res, next) {
  let id = req.params.id;
  Book.findById(id, (err, book) => {
    res.status(200).json(book);
  });
});
router.put("/:id", function (req, res, next) {
  let id = req.params.id;
  Book.findByIdAndUpdate(id, req.body, (err, book) => {
    res.send(`${book} updated successfully!`);
  });
});
// DELETE /api/books/:id - delete a book
router.delete("/:id", function (req, res, next) {
  let id = req.params.id;
  Book.findByIdAndDelete(id, (err, book) => {
    res.send(`${book} deleted successfully!`);
  });
});
module.exports = router;
