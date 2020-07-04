const db = require('../models');
const axios = require('axios');

module.exports = (app) => {

  app.get('/', async (req, res) => {
    try {
      const articles = await axios.get('/api/articles');
      res.render('index', {
        articles: articles.data
      });
    } catch (err) {
      console.log(err)
    }
  });

  app.get('/favorites', async (req, res) => {
    try {
      const articles = await axios.get('/api/articles/favorites');
      res.render('favorites', {
        articles: articles.data
      });
    } catch (err) {
      console.log(err)
    }
  })
};