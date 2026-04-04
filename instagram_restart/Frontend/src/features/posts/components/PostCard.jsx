import React, { useState, useRef } from 'react';
import styles from './PostCard.module.scss';
import VideoPlayer from './VideoPlayer';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';

const PostCard = ({ post }) => {
  // Array fallback if simple mediaUrl string is provided instead of media array
  const mediaArray = post.media || (post.mediaUrl ? [{ _id: '1', url: post.mediaUrl, media_type: 'image' }] : []);

  // Simple state to track active carousel slide for indicators
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollRef = useRef(null);

  const handleScroll = (e) => {
    if (!scrollRef.current) return;
    const scrollPosition = e.target.scrollLeft;
    const slideWidth = e.target.offsetWidth;
    // Calculate the closest visible slide based on scroll width vs total width
    const currentIndex = Math.round(scrollPosition / slideWidth);
    if (currentIndex !== activeSlide) {
      setActiveSlide(currentIndex);
    }
  };

  return (
    <article className={styles.post}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.authorInfo}>
          <div className={styles.avatarWrapper}>
            <img
              src={post.author?.profilePicture || "https://imgs.search.brave.com/Y20_Qf09jZ8KyraFayP-Bh7mXPopmU4Pc6JBLcB4CBY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMjcv/OTUxLzEzMC9zbWFs/bC9hZnJpY2EtZ3V5/LTNkLWF2YXRhci1j/aGFyYWN0ZXItaWxs/dXN0cmF0aW9ucy1w/bmcucG5n"}
              alt={post.author?.username || 'User'}
              className={styles.avatar}
            />
          </div>
          <div className={styles.meta}>
            <span className={styles.username}>{post.author?.username || 'Unknown'}</span>
            {post.author?.location && (
              <span className={styles.location}>{post.author.location}</span>
            )}
          </div>
        </div>
        <button className={styles.moreBtn}>
          <MoreHorizontal size={20} />
        </button>
      </header>

      {/* Media Carousel */}
      <div className={styles.carouselContainer}>
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className={styles.mediaCarousel}
        >
          {mediaArray.map((item, index) => (
            <div key={item._id || index} className={styles.carouselItem}>
              {item.media_type === 'video' ? (
                <VideoPlayer url={item.url} />
              ) : (
                <img
                  src={item.url}
                  alt={`Post Content ${index + 1}`}
                  className={styles.media}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <div className={styles.leftActions}>
          <button aria-label="Like" className={styles.likeHover}>
            <Heart size={26} strokeWidth={1.5} />
          </button>
          <button aria-label="Comment">
            <MessageCircle size={26} strokeWidth={1.5} />
          </button>
          <button aria-label="Share">
            <Send size={26} strokeWidth={1.5} />
          </button>
        </div>

        {/* Carousel dots in the center of the action bar */}
        {mediaArray.length > 1 && (
          <div className={styles.carouselDots}>
            {mediaArray.map((_, i) => (
              <div
                key={i}
                className={`${styles.dot} ${i === activeSlide ? styles.active : styles.inactive}`}
              />
            ))}
          </div>
        )}

        <div className={styles.rightActions}>
          <button aria-label="Save">
            <Bookmark size={26} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Likes */}
      <div className={styles.likes}>
        {(post.likes || 0).toLocaleString()} likes
      </div>

      {/* Caption */}
      <div className={styles.captionSection}>
        <span className={styles.captionUsername}>{post.author?.username || 'Unknown'}</span>
        <span className={styles.captionText}>{post.caption}</span>
      </div>

      {/* Timestamp */}
      <div className={styles.timestamp}>
        {post.timeAgo ? post.timeAgo : new Date(post.createdAt || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
      </div>

      {/* Add Comment */}
      <div className={styles.addComment}>
        <input type="text" placeholder="Add a comment..." />
        <button className={styles.postBtn}>Post</button>
      </div>
    </article>
  );
};

export default PostCard;
