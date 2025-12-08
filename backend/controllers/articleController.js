const articleRepository = require('../data/articleRepository');

exports.getAllArticles = (req, res) => {
  const articles = articleRepository.getAllArticles();

  res.status(200).json({
    status: 'success',
    data: {
      articles,
    },
  });
};

exports.getArticleById = (req, res) => {
  const article = articleRepository.getArticleById(req.params.id);

  if (!article) {
    return res.status(404).json({
      status: 'fail',
      message: 'Article is not found',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      article,
    },
  });
};

exports.createArticle = async (req, res) => {
  if (!req.body?.title || !req.body?.content) {
    return res.status(400).json({
      status: 'fail',
      message: 'The article should contain title and content',
    });
  }

  const newArticle = articleRepository.createArticle(req.body);

  try {
    await articleRepository.saveArticleToFile();

    res.status(201).json({
      status: 'success',
      data: {
        article: newArticle,
      },
    });
  } catch (err) {
    articleRepository.removeArticleAfterError();

    res.status(500).json({
      status: 'error',
      message: 'There was an error while saving an article. Please try again',
    });
  }
};
