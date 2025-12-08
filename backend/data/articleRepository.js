const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const fsPromises = fs.promises;

let articles = [];
const FILE_PATH = path.join(__dirname, 'articles.json');

try {
  articles = JSON.parse(fs.readFileSync(FILE_PATH, 'utf-8'));
} catch (err) {
  // TODO: catch file path error and create new file
  console.log(err);
}

exports.getAllArticles = () => articles;

exports.getArticleById = (id) =>
  articles.find((article) => article.id === id) ?? null;

exports.createArticle = (articleData) => {
  const newArticle = {
    ...articleData,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  };

  articles.push(newArticle);

  return newArticle;
};

exports.saveArticleToFile = async () => {
  const json = JSON.stringify(articles, null, 2);

  return await fsPromises.writeFile(FILE_PATH, json, 'utf-8');
};

exports.removeArticleAfterError = () => {
  articles.pop();
};
