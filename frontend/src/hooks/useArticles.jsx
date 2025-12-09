import { useEffect, useState } from 'react';
import { getAllArticles } from '../api/articlesApi';

export default function useArticles() {
  const [articles, setArticles] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadArticles() {
      try {
        setIsLoading(true);
        setError(null);
        const articlesData = await getAllArticles();
        setArticles(articlesData);
      } catch (err) {
        setError(err.message || 'Failed to load articles');
      } finally {
        setIsLoading(false);
      }
    }

    loadArticles();
  }, []);

  return { articles, isLoading, error };
}
