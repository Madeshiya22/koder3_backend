import React from 'react'
import { useSelector } from 'react-redux'
import styles from './Profile.module.scss'

const Profile = () => {
    const user = useSelector((store) => store.auth.user)

    return (
        <div className={styles.container}>
            <div className={styles.profileCard}>
                <div className={styles.avatar}>
                    {user?.fullname?.[0]?.toUpperCase() || '?'}
                </div>
                <div className={styles.userInfo}>
                    <h1 className={styles.fullname}>{user?.fullname || 'Guest User'}</h1>
                    <p className={styles.username}>@{user?.username || 'guest'}</p>
                    <p className={styles.email}>{user?.email || 'No email provided'}</p>
                </div>
            </div>
        </div>
    )
}

export default Profile