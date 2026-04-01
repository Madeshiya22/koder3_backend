import React, { useState } from 'react';
import { ImagePlus } from 'lucide-react';
import styles from './CreatePost.module.scss';

const CreatePost = () => {
    const [dragActive, setDragActive] = useState(false);
    const [caption, setCaption] = useState('');

    const handleDrag = function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = function (e) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            // handle file
            console.log("Files dropped", e.dataTransfer.files);
        }
    };

    
    const handleFileChange = function (e) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.target.files && e.target.files[ 0 ]) {
            const files = e.target.files;
            fileInputRef.current = files;
        }
    }

    const handleShare = async () => {

        console.log(fileInputRef.current)

        const data = await handleCreatePost({
            files: fileInputRef.current,
            caption
        })

        navigate('/')

    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>

                {/* Visual Area for Media Upload */}
                <div
                    className={`${styles.uploadArea} ${dragActive ? styles.dragActive : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <div className={styles.dashedBorder} />

                    <div className={styles.uploadContent}>
                        <div className={styles.iconWrapper}>
                            <ImagePlus strokeWidth={1} size={42} />
                        </div>
                        <h3>Drag photos and videos here</h3>
                        <p>
                            Support for JPG, PNG, and MP4 files. Maximum size 50MB.
                        </p>

                        <label className={styles.selectBtn}>
                            <span>Select from computer</span>
                            <input 
                              type="file" 
                              accept="image/*,video/*" 
                              multiple 
                            />
                        </label>
                    </div>
                </div>

                {/* Content Area for Details */}
                <div className={styles.detailsArea}>
                    <div className={styles.header}>
                        <h2>Create new post</h2>
                        <button className={styles.shareBtn}>
                            Share
                        </button>
                    </div>

                    <div className={styles.content}>
                        <div className={styles.userInfo}>
                            {/* Current User Placeholder */}
                            <div className={styles.avatar}></div>
                            <span className={styles.username}>current_user</span>
                        </div>

                        <textarea
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            placeholder="Write a caption..."
                            className={styles.captionInput}
                            rows={8}
                        />

                        <div className={styles.footer}>
                            <button className={styles.emojiBtn} aria-label="Add Emoji">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <circle cx="12" cy="12" r="10" />
                                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                                  <line x1="9" y1="9" x2="9.01" y2="9" />
                                  <line x1="15" y1="9" x2="15.01" y2="9" />
                                </svg>
                            </button>
                            <span className={styles.charCount}>{caption.length}/2200</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
