import { Link } from 'react-router-dom';

const ArticleListItem = ({ post }) => {
  return (
    <div>
      <h2>{post.name}</h2>
      <p>{post.text}</p>
      <Link to={`/articles/${post.id}`}>Read more</Link>
    </div>
  );
};

export default ArticleListItem;
