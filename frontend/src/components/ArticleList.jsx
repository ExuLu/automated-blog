import { useState } from 'react';

import ArticleListItem from './ArticleListItem';
import mockPosts from '../mockPosts';

import styles from './ArticleList.module.css';

const ArticleList = () => {
  const [posts] = useState(mockPosts);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Automated Blog</h1>
      <div className={styles.list}>
        {posts.map((post) => (
          <ArticleListItem key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default ArticleList;
