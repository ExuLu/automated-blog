const express = require('express');
const articleController = require('../controllers/articleController');
const articleValidators = require('../validation/articleValidators');

const router = express.Router();

router
  .route('/')
  .get(articleController.getAllArticles)
  .post(articleValidators.validateArticle, articleController.createArticle);
router.route('/:id').get(articleController.getArticleById);

module.exports = router;
