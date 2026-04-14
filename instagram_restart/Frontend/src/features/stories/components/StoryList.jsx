import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getStoriesFeed } from '../services/story.api';
import StoryItem from './StoryItem';
import styles from './StoryList.module.scss';

const StoryList = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [storyBuckets, setStoryBuckets] = useState([]);
  const [ownStories, setOwnStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadStories = async () => {
      try {
        setLoading(true);
        const data = await getStoriesFeed();

        if (!mounted) {
          return;
        }

        setStoryBuckets(data.stories || []);
        setOwnStories(data.ownStories || []);
      } catch (error) {
        if (mounted) {
          setStoryBuckets([]);
          setOwnStories([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadStories();

    return () => {
      mounted = false;
    };
  }, []);

  const ownAvatar = user?.profileImage || user?.profilePicture || '';
  const ownHasStory = ownStories.length > 0;
  const ownLabel = 'Your story';

  const feedStories = useMemo(() => {
    return storyBuckets.filter((bucket) => bucket?.user?._id !== user?._id);
  }, [storyBuckets, user?._id]);

  const handlePlusClick = () => {
    navigate('/stories/upload');
  };

  const handleOwnStoryClick = () => {
    if (!ownHasStory || !user?._id) {
      return;
    }

    navigate(`/stories/${user._id}`, {
      state: {
        user: {
          username: user.username,
          profileImage: ownAvatar,
        },
      },
    });
  };

  const handleStoryClick = (bucket) => {
    if (!bucket?.user?._id) {
      return;
    }

    navigate(`/stories/${bucket.user._id}`, {
      state: {
        user: bucket.user,
      },
    });
  };

  return (
    <section className={styles.wrapper}>
      <div className={styles.strip}>
        <StoryItem
          label={ownLabel}
          avatarUrl={ownHasStory ? ownAvatar : ''}
          hasStory={ownHasStory}
          isOwn
          onStoryClick={handleOwnStoryClick}
          onPlusClick={handlePlusClick}
        />

        {!loading
          ? feedStories.map((bucket) => (
              <StoryItem
                key={bucket.user._id}
                label={bucket.user.username}
                avatarUrl={bucket.user.profileImage || bucket.user.profilePicture || bucket.stories?.[0]?.imageUrl}
                hasStory={Boolean(bucket.stories?.length)}
                isOwn={false}
                onStoryClick={() => handleStoryClick(bucket)}
                onPlusClick={() => {}}
              />
            ))
          : null}
      </div>
    </section>
  );
};

export default StoryList;
