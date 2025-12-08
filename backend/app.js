const express = require('express');
const articleRouter = require('./routes/articleRoute');

const app = express();
app.use(express.json());

app.use('/api/articles', articleRouter);
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: 'Page not found',
  });
});

module.exports = app;
