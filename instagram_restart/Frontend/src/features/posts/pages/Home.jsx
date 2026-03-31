import React from 'react';
import styles from './Home.module.scss';
import PostCard from '../components/PostCard';

const MOCK_POSTS = [
  {
    _id: "1",
    author: {
      username: 'digital.curator',
      profilePicture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      location: 'New York, USA'
    },
    media: [
        { _id: '1', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1080&q=80', media_type: 'image' },
        { _id: '2', url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', media_type: 'video' }
    ],
    likes: 1245,
    caption: 'Minimalist living spaces inspire the clearest thoughts. Swipe to see the video walkthrough. ✨',
    timeAgo: '2 HOURS AGO'
  },
  {
    _id: "2",
    author: {
      username: 'arch.digest',
      profilePicture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    },
    media: [
        { _id: '3', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1080&q=80', media_type: 'image' }
    ],
    likes: 890,
    caption: 'Concrete, light, and geometry. A brutalist approach to modern office space.',
    timeAgo: '5 HOURS AGO'
  }
];

const Home = () => {
  return (
    <div className={styles.container}>
      <div className={styles.feed}>
        {MOCK_POSTS.map(post => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Home;