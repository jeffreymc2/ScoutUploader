// hooks/useGenerateArticle.js
import { useState } from 'react';

const useGenerateArticle = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [article, setArticle] = useState(null);

  const generateArticle = async (gameId: any) => {
    setIsLoading(true);
    setError(null);
    setArticle(null);

    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gameId }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate article');
      }

      const data = await response.json();
      setArticle(data.article);
    } catch (err: any) {
        setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, article, generateArticle };
};

export default useGenerateArticle;