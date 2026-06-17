import PostBox from '../../components/ui/PostBox/PostBox.jsx'
import PostCard from "../../components/ui/PostCard/PostCard.jsx"
import { usePost } from '../../providers/PostContext.jsx';

const Feed = () => {
  const { posts } = usePost();

  return (
    <>
      <PostBox />
      {posts.map((post) => (
        <PostCard
          key={post._id}
          owner={post.owner}
          description={post.description}
          media={post.media || ""}
          createdAt={post.createdAt}
          likesCount={post.likesCount}
          likedByMe={post.likedByMe}
          savedByMe={post.savedByMe}
          id={post._id}
        />
      ))}
    </>
  );
};


export default Feed