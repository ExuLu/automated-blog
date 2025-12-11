import { useState } from 'react';

export default function GenerateArticleForm() {
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async function (e) {
    e.preventDefault();

    if (!topic) return;
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        onChange={(e) => {
          setTopic(e.target.value);
        }}
        placeholder='Enter topic'
      >
        {topic}
      </input>
      <button>Generate</button>
    </form>
  );
}
