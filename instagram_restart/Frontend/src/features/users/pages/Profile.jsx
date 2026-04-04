import React from 'react'
import { useSelector } from 'react-redux'
import styles from './Profile.module.scss'

const Profile = () => {
    const user = useSelector((store) => store.auth.user)
    
    // Fallback initials
    const initials = user?.fullname ? user.fullname.charAt(0).toUpperCase() : user?.username?.charAt(0).toUpperCase() || 'U';

    return (
        <div className={styles.profileContainer}>
            <div className={styles.profileCard}>
                <div className={styles.avatarPlaceholder}>
                    {initials}
                </div>
                <h1 className={styles.fullname}>{user?.fullname || 'Unknown User'}</h1>
                <p className={styles.username}>@{user?.username || 'username'}</p>
                <p className={styles.email}>{user?.email || 'No email provided'}</p>
                
                <div className={styles.statsRow}>
                    <div className={styles.stat}>
                        <span className={styles.statValue}>0</span>
                        <span className={styles.statLabel}>Posts</span>
                    </div>
                    <div className={styles.stat}>
                        <span className={styles.statValue}>0</span>
                        <span className={styles.statLabel}>Followers</span>
                    </div>
                    <div className={styles.stat}>
                        <span className={styles.statValue}>0</span>
                        <span className={styles.statLabel}>Following</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile