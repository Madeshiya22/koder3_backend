import React, { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import styles from './StoryViewer.module.scss';

const STORY_DURATION_MS = 10000;
const TICK_MS = 100;

const StoryViewer = ({ stories, user, onClose }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);

  const safeStories = useMemo(() => (Array.isArray(stories) ? stories : []), [stories]);

  useEffect(() => {
    setActiveIndex(0);
    setElapsedMs(0);
  }, [safeStories.length]);

  useEffect(() => {
    if (!safeStories.length) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setElapsedMs((prev) => {
        const next = prev + TICK_MS;

        if (next >= STORY_DURATION_MS) {
          setActiveIndex((curr) => {
            if (curr >= safeStories.length - 1) {
              onClose();
              return curr;
            }
            return curr + 1;
          });

          return 0;
        }

        return next;
      });
    }, TICK_MS);

    return () => {
      window.clearInterval(timer);
    };
  }, [safeStories.length, onClose]);

  useEffect(() => {
    setElapsedMs(0);
  }, [activeIndex]);

  const goNext = () => {
    setElapsedMs(0);
    setActiveIndex((curr) => {
      if (curr >= safeStories.length - 1) {
        onClose();
        return curr;
      }
      return curr + 1;
    });
  };

  const goPrev = () => {
    setElapsedMs(0);
    setActiveIndex((curr) => Math.max(0, curr - 1));
  };

  if (!safeStories.length) {
    return (
      <div className={styles.overlay}>
        <button className={styles.closeBtn} type="button" onClick={onClose} aria-label="Close viewer">
          <X size={22} />
        </button>
        <div className={styles.empty}>No active stories</div>
      </div>
    );
  }

  const current = safeStories[activeIndex];
  const progress = Math.min((elapsedMs / STORY_DURATION_MS) * 100, 100);

  return (
    <div className={styles.overlay}>
      <div className={styles.header}>
        <div className={styles.progressTrack}>
          {safeStories.map((story, index) => {
            let fill = 0;
            if (index < activeIndex) {
              fill = 100;
            } else if (index === activeIndex) {
              fill = progress;
            }

            return (
              <span key={story._id || `${index}-${story.createdAt}`} className={styles.progressSegment}>
                <span className={styles.progressFill} style={{ width: `${fill}%` }} />
              </span>
            );
          })}
        </div>

        <button className={styles.closeBtn} type="button" onClick={onClose} aria-label="Close viewer">
          <X size={22} />
        </button>
      </div>

      <div className={styles.meta}>
        <img
          src={user?.profileImage || user?.profilePicture || current.imageUrl}
          alt={user?.username || 'story user'}
          className={styles.avatar}
        />
        <span className={styles.username}>{user?.username || 'story'}</span>
      </div>

      <div className={styles.body}>
        <button type="button" className={styles.navLeft} onClick={goPrev} aria-label="Previous story" />
        <img src={current.imageUrl} alt="story" className={styles.storyImage} />
        <button type="button" className={styles.navRight} onClick={goNext} aria-label="Next story" />
      </div>
    </div>
  );
};

export default StoryViewer;
