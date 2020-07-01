var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/newsScraper", { useNewUrlParser: true, useFindAndModify: false });

// Routes

// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with axios
  axios.get("https://thenextweb.com/dd/page/2/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $(".story").each(function(i, element) {
      // Save an empty result object
      var result = {};


      console.log($(this).children('.story-text').children('.story-title').children('a').text());

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this).children('.story-text').children('.story-title').children('a').text();
      result.summary = $(this).children('.story-text').children('.story-chunk').text();
      result.link = $(this).children('.story-text').children('.story-title').children('a').attr("href");

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result).then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
    });
    // Send a message to the client
    res.send("Scrape Complete");
  });
});

// Route for getting all Articles from the db
app.get("/articles", async function(req, res) {
  // TODO: Finish the route so it grabs all of the articles
  const articles = await db.Article.find();
  res.json(articles);
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", async function(req, res) {
  // TODO
  // ====
  // Finish the route so it finds one article using the req.params.id,
  // and run the populate method with "note",
  // then responds with the article with the note included
  const article = await db.Article.find({ _id: req.params.id }).populate('note');
  res.json(article);
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // TODO
  // ====
  // save the new note that gets posted to the Notes collection
  // then find an article from the req.params.id
  // and update it's "note" property with the _id of the new note
  db.Note.create({
    title: req.body.title,
    body: req.body.body
  }).then(function(dbNote) {
    // View the added result in the console
    console.log(dbNote);
    db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id })
        .then(function(dbArticle) {
          // Show updated article.
          console.log(dbArticle);
          res.send("Note Added!");
        }). catch(function(err) {
          console.log(err);
    })

  }).catch(function(err) {
    // If an error occurred, log it
    console.log(err);
  });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
