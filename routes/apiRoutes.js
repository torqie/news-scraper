// Controllers
const articlesController = require('../controllers/articles.controller');
const commentsController = require('../controllers/comments.controller');

module.exports = (app) => {
  // ARTICLE ROUTES
  // =============================================================
  // Scrape Articles
  app.get('/api/scrape', articlesController.scrape);
  // Get All Articles
  app.get('/api/articles', articlesController.all);
  // Get A Single Article
  app.get('/api/articles/:id', articlesController.one);
  // Delete A Article
  app.delete('/api/articles/:id', articlesController.delete);

  // COMMENT ROUTES
  // =============================================================
  // Get All Comments
  app.get('/api/comments', commentsController.all);
  // Get A Single Comment
  app.get('/api/comments/:id', commentsController.one);
  // Create A Comment
  app.post('/api/comments', commentsController.create);
  // Delete A Comment
  app.delete('/api/comments/:id', commentsController.delete);
};