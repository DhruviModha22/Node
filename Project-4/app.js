const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const multer = require("multer");
const BookModel = require("./models/Book");
const port = 8081;

const app = express();

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Not an image! Please upload an image."), false);
    }
  }
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(methodOverride("_method"));

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// MongoDB connection
const connection = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/bookstore");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Could not connect to MongoDB:", error);
  }
};

// Routes
app.get("/", async (req, res) => {
  try {
    const books = await BookModel.find({});
    res.render("books/index", { books });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

app.get("/books/new", (req, res) => {
  res.render("books/new");
});

app.post("/books", upload.single("image"), async (req, res) => {
  try {
    const bookData = req.body;
    if (req.file) {
      bookData.image = req.file.filename;
    }
    await BookModel.create(bookData);
    console.log("Book added successfully");
    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.redirect("/books/new");
  }
});

app.get("/books/:id", async (req, res) => {
  try {
    const book = await BookModel.findById(req.params.id);
    if (!book) {
      return res.redirect("/");
    }
    res.render("books/show", { book });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

app.get("/books/:id/edit", async (req, res) => {
  try {
    const book = await BookModel.findById(req.params.id);
    if (!book) {
      return res.redirect("/");
    }
    res.render("books/edit", { book });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

app.put("/books/:id", upload.single("image"), async (req, res) => {
  try {
    const bookData = req.body;
    if (req.file) {
      bookData.image = req.file.filename;
    }
    await BookModel.findByIdAndUpdate(req.params.id, bookData);
    console.log("Book updated successfully");
    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

app.delete("/books/:id", async (req, res) => {
  try {
    await BookModel.findByIdAndDelete(req.params.id);
    console.log("Book deleted successfully");
    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

app.listen(port, (error) => {
  if (error) {
    console.log("Server is not connected");
    return;
  }
  connection();
  console.log("Server is running on port", port);
}); 