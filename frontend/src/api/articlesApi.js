const isBrowser = typeof window !== 'undefined';

function resolveApiUrl() {
  const envUrl = import.meta.env.VITE_API_URL;

  if (!envUrl) {
    return isBrowser ? `${window.location.origin}/api` : '/api';
  }

  const envPointsToLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)/i.test(
    envUrl
  );
  const servedFromRemoteHost =
    isBrowser &&
    !/^https?:\/\/(localhost|127\.0\.0\.1)/i.test(window.location.origin);

  if (envPointsToLocalhost && servedFromRemoteHost) {
    return `${window.location.origin}/api`;
  }

  return envUrl;
}

const API_URL = resolveApiUrl();

async function request(path, options = {}) {
  const config = { ...options };

  if (config.body && !config.headers) {
    config.headers = { 'Content-Type': 'application/json' };
  }

  const response = await fetch(`${API_URL}${path}`, config);

  const data = await response.json();

  if (!response.ok) {
    const message = data?.message || 'Something went wrong';
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return data;
}

export async function getAllArticles() {
  const result = await request('/articles');
  return result.data.articles;
}

export async function getArticleById(id) {
  const result = await request(`/articles/${id}`);
  return result.data.article;
}

export async function generateAndAddArticle(topic) {
  const config = { method: 'POST', body: JSON.stringify({ topic }) };
  const result = await request(`/articles/generate`, config);
  return result.data.article;
}
