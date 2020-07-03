const db = require('../models');
const axios = require('axios');
const cheerio = require('cheerio');

// Get all articles
exports.all = async (req, res) => {
  const articles = await db.Article.find();
  return res.json(articles);
};
// Get one article
exports.one = async (req, res) => {
  const article = await db.Article.find({ _id: req.params.id }).populate('comments');
  return res.json(article);
};
// Delete an article
exports.delete = async (req, res) => {
  const article = await db.Article.deleteOne({ _id: req.params.id});
  return res.json(article);
};
// Scrape articles
exports.scrape = async (req, res) => {
  let newArticleCount = 0;

    axios.get("https://thenextweb.com/dd/page/3").then( async function(webContent) {
      const $ = cheerio.load(webContent.data);

      await $(".story").each(function(i, element) {
        const result = {};
        result.title = $(element).children('.story-text').children('.story-title').children('a').text();
        result.link = $(element).children('.story-text').children('.story-title').children('a').attr("href");
        result.summary = $(element).children('.story-text').children('.story-chunk').text();


          db.Article.create(result).then(function(response) {
            newArticleCount++;
            console.log(newArticleCount);
          }).catch(function (error) {
            console.log(error);
          });
      });

    }).catch(function(error) {
      console.log(error);
    });
  return res.json({ success: true, scrapeCount: newArticleCount });
};