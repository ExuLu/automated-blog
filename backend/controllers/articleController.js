const { v4: uuidv4 } = require('uuid');

exports.getAllArticles = (req, res) => {
  try {
    res.status(200).json({
      status: 'success',
    });
  } catch (err) {
    res.status(err.status).json({
      status: err.status,
      error: err,
      message: err.message,
    });
  }
};

exports.getArticleById = (req, res) => {
  try {
    res.status(200).json({
      status: 'success',
    });
  } catch (err) {
    res.status(err.status).json({
      status: err.status,
      error: err,
      message: err.message,
    });
  }
};

exports.createArticle = (req, res) => {
  console.log(req.body);
  const newArticle = { ...req.body, id: uuidv4() };

  res.status(201).json({
    status: 'success',
    data: {
      article: newArticle,
    },
  });
};
