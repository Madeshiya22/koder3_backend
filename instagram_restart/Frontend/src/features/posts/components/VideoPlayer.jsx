import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from "lucide-react";
import styles from './VideoPlayer.module.scss';

const VideoPlayer = ({ url }) => {
    const [ isMuted, setIsMuted ] = useState(true);
    const videoRef = useRef(null);

    const toggleMute = () => {
        setIsMuted(!isMuted);
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
        }
    };

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(e => console.log('Autoplay prevented', e));
        }
    }, []);

    return (
        <div className={styles.videoContainer}>
            <video
                ref={videoRef}
                src={url}
                autoPlay
                loop
                playsInline
                muted={isMuted}
            />
            <button
                onClick={toggleMute}
                className={styles.muteBtn}
            >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
        </div>
    );
};

export default VideoPlayer;
