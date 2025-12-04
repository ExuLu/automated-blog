import { Link, useParams } from 'react-router-dom';
import mockPosts from '../mockPosts';

import styles from './ArticleItemDetailed.module.css';

const ArticleItemDetailed = () => {
  const { id: postId } = useParams();
  const post = mockPosts.find((post) => post.id === Number(postId));

  return (
    <div className={styles.root}>
      {post ? (
        <>
          <h1 className={styles.title}>{post.name}</h1>
          <p className={styles.text}>{post.text}</p>
          <p className={styles.meta}>{post.date}</p>
        </>
      ) : (
        <p className={styles.notFound}>Post not found</p>
      )}
      <Link className={styles.backLink} to='/articles'>
        Back to Main Page
      </Link>
    </div>
  );
};

export default ArticleItemDetailed;
