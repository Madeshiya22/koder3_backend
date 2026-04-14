import React, { useEffect, useRef, useState } from 'react';
import { ChevronRight, PlusCircle } from 'lucide-react';
import { getHomeStories, uploadStory } from '../services/story.api';
import styles from './StoriesBar.module.scss';

const StoriesBar = () => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const inputRef = useRef(null);
    const stripRef = useRef(null);
    const [showScrollNext, setShowScrollNext] = useState(false);

    const updateScrollState = () => {
        const strip = stripRef.current;
        if (!strip) return;
        const hasOverflow = strip.scrollWidth > strip.clientWidth + 12;
        const nearEnd = strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - 8;
        setShowScrollNext(hasOverflow && !nearEnd);
    };

    const loadStories = async () => {
        try {
            setLoading(true);
            const data = await getHomeStories();
            setStories(data);
        } catch (error) {
            setStories([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStories();
    }, []);

    useEffect(() => {
        updateScrollState();
        const strip = stripRef.current;
        if (!strip) return;

        const onScroll = () => updateScrollState();
        const onResize = () => updateScrollState();

        strip.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onResize);

        return () => {
            strip.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onResize);
        };
    }, [stories.length, loading]);

    const handleUploadClick = () => {
        inputRef.current?.click();
    };

    const handleStoryChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            await uploadStory({ storyImage: file });
            await loadStories();
        } finally {
            setUploading(false);
            event.target.value = '';
        }
    };

    const scrollNext = () => {
        const strip = stripRef.current;
        if (!strip) return;
        strip.scrollBy({ left: 280, behavior: 'smooth' });
    };

    return (
        <section className={styles.storiesSection}>
            <div className={styles.storiesWrap}>
                <div ref={stripRef} className={styles.storiesStrip}>
                <button type="button" className={`${styles.storyCard} ${styles.uploadCard}`} onClick={handleUploadClick} disabled={uploading}>
                    <div className={styles.uploadRing}>
                        <PlusCircle size={28} />
                    </div>
                    <span className={styles.storyLabel}>{uploading ? 'uploading...' : 'your story'}</span>
                </button>

                {loading ? (
                    <div className={styles.loadingState}>
                        <span className={styles.loadingCircle}></span>
                        <span className={styles.loadingCircle}></span>
                        <span className={styles.loadingCircle}></span>
                    </div>
                ) : (
                    stories.map((story) => (
                        <article key={story._id} className={styles.storyCard} title={story.user?.username}>
                            <div className={styles.storyRing}>
                                <img
                                    src={story.user?.profileImage || story.user?.profilePicture || story.imageUrl}
                                    alt={story.user?.username}
                                    className={styles.storyAvatar}
                                />
                            </div>
                            <span className={styles.storyLabel}>{story.user?.username}</span>
                        </article>
                    ))
                )}
                </div>

                {showScrollNext && (
                    <button type="button" className={styles.scrollNextBtn} onClick={scrollNext} aria-label="Scroll stories">
                        <ChevronRight size={17} strokeWidth={2.8} />
                    </button>
                )}
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleStoryChange}
            />
        </section>
    );
};

export default StoriesBar;