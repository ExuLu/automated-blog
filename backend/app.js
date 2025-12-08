const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const cors = require('cors');
const articleRouter = require('./routes/articleRoute');

const app = express();

app.use(helmet());

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP. Please try again in an hour!',
});
app.use('/api', limiter);

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  })
);

app.use(express.json({ limit: '10kb' }));
app.use(xss());

app.use('/api/articles', articleRouter);
app.use((req, res) => {
  res.status(404).json({
    status: 'fail',
    message: 'Page not found',
  });
});

module.exports = app;
