import { Link, useParams } from 'react-router-dom';
import mockPosts from '../mockPosts';

const ArticleItemDetailed = () => {
  const { id: postId } = useParams();
  const post = mockPosts.find((post) => post.id === Number(postId));

  return (
    <div>
      {post ? (
        <>
          <h1>{post.name}</h1>
          <p>{post.text}</p>
          <p>{post.date}</p>
        </>
      ) : (
        <p>Post not found</p>
      )}
      <Link to='/articles'>Back to Main Page</Link>
    </div>
  );
};

export default ArticleItemDetailed;
