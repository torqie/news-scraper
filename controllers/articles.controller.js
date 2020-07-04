const db = require('../models');
const axios = require('axios');
const cheerio = require('cheerio');

// Get all articles
exports.all = async (req, res) => {
  const articles = await db.Article.find().populate('comments');
  return res.status("200").send(articles);
};
// Get one article
exports.one = async (req, res) => {
  const article = await db.Article.find({ _id: req.params.id }).populate('comments');
  return res.status("200").send(article);
};
// Delete an article
exports.delete = async (req, res) => {
  const article = await db.Article.deleteOne({ _id: req.params.id});
  return res.json(article);
};
// Save article as a favorite
exports.updateFavorite = async (req, res) => {
  const article = await db.Article.findOne({ _id: req.params.id });
  article.favorite = !article.favorite;
  await article.save();
  return res.status("200").send(article);
};
// Return all articles that are saved as a favorite.
exports.allFavorites = async (req, res) => {
  const articles = await db.Article.find({ favorite: true }).populate('comments');
  return res.status("200").send(articles);
};
// Scrape articles
exports.scrape = async (req, res) => {
  let newArticles = [];
  const scrape = await axios.get("https://thenextweb.com/dd/");
  const $ = await cheerio.load(scrape.data);

  await $(".story").each(async (i, element) => {
    const result = {};
    result.title = $(element).children('.story-text').children('.story-title').children('a').text();
    result.link = $(element).children('.story-text').children('.story-title').children('a').attr("href");
    result.summary = $(element).children('.story-text').children('.story-chunk').text();
    const newArticle = await db.Article.create(result);
    await newArticles.push(newArticle);
  });
  return res.status('200').send(newArticles);
};