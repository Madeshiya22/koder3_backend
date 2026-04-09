import React from 'react'
import { Image, Video as VideoIcon } from 'lucide-react'
import styles from './PostGrid.module.scss'

const PostGrid = ({ posts = [], tab = 'posts' }) => {
    const getEmptyMessage = () => {
        switch(tab) {
            case 'posts': return 'No posts yet'
            case 'videos': return 'No videos yet'
            case 'bookmarks': return 'You haven\'t saved any posts yet'
            case 'tagged': return 'No tagged posts yet'
            default: return 'No content yet'
        }
    }

    if (!posts || posts.length === 0) {
        return (
            <div className={styles.emptyGrid}>
                <div className={styles.emptyContent}>
                    <div className={styles.emptyIcon}>
                        {tab === 'videos' ? (
                            <VideoIcon size={40} />
                        ) : (
                            <Image size={40} />
                        )}
                    </div>
                    <p className={styles.emptyText}>{getEmptyMessage()}</p>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.gridContainer}>
            {posts.map((post) => (
                <div key={post._id} className={styles.gridItem}>
                    <div className={styles.imageContainer}>
                        {post.media && post.media.length > 0 && (
                            <>
                                {post.media[0].type === 'video' ? (
                                    <video 
                                        src={post.media[0].url}
                                        className={styles.itemImage}
                                        onMouseOver={(e) => {
                                            if (e.target.paused) {
                                                e.target.play().catch(() => {})
                                            }
                                        }}
                                        onMouseOut={(e) => {
                                            e.target.pause()
                                            e.target.currentTime = 0
                                        }}
                                    />
                                ) : (
                                    <img 
                                        src={post.media[0].url}
                                        alt="post"
                                        className={styles.itemImage}
                                    />
                                )}
                                {post.media.length > 1 && (
                                    <div className={styles.multipleIndicator}>
                                        <span>+{post.media.length - 1}</span>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    
                    <div className={styles.itemOverlay}>
                        <div className={styles.stats}>
                            <span className={styles.stat}>
                                ♥ {post.likeCount || 0}
                            </span>
                            <span className={styles.stat}>
                                💬 {post.commentCount || 0}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default PostGrid
