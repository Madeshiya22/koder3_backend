import React from 'react';
import { Plus } from 'lucide-react';
import styles from './StoryItem.module.scss';

const StoryItem = ({
  label,
  avatarUrl,
  hasStory,
  isOwn,
  onStoryClick,
  onPlusClick,
}) => {
  const shouldOpenUpload = isOwn && !hasStory;
  const storyDisabled = !hasStory && !isOwn;
  const handleAvatarClick = shouldOpenUpload ? onPlusClick : onStoryClick;

  return (
    <article className={styles.storyItem}>
      <div className={styles.avatarWrap}>
        <button
          type="button"
          className={`${styles.avatarBtn} ${hasStory ? styles.hasStory : ''}`}
          onClick={handleAvatarClick}
          disabled={storyDisabled}
          aria-label={hasStory ? `View ${label} story` : shouldOpenUpload ? 'Upload story' : `${label} has no active story`}
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt={label} className={styles.avatarImage} />
          ) : (
            <span className={styles.noStoryIcon}>
              <Plus size={24} />
            </span>
          )}
        </button>

        {isOwn && hasStory ? (
          <button
            type="button"
            className={styles.plusBtn}
            onClick={onPlusClick}
            aria-label="Upload story"
          >
            <Plus size={14} />
          </button>
        ) : null}
      </div>

      <span className={styles.label}>{label}</span>
    </article>
  );
};

export default StoryItem;
