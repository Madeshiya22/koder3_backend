import React from 'react';
import styles from './Home.module.scss';
import PostCard from '../components/PostCard';
import { useSelector } from 'react-redux';
import { usePost } from '../hooks/usePost';
import { useEffect } from 'react';
import StoriesBar from '../../stories/components/StoriesBar';


const Home = () => {
  const {handleGetPosts} = usePost()
  const posts = useSelector((store) => store.posts.posts) 
  useEffect(() => {
    handleGetPosts()
    console.log(posts)
  }, [])
  return (
    <div className={styles.container}>
      <StoriesBar />
      <div className={styles.feed}>
        {posts.map(post => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Home;