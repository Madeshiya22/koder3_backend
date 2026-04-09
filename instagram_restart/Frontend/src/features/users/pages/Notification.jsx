import React, { useEffect } from 'react'
import { useUser } from '../hooks/useUser'
import { useSelector } from 'react-redux'
import styles from './Notification.module.scss'

const Notification = () => {
    const { handleGetFollowRequests, handleAcceptFollowRequest } = useUser()
    const followRequests = useSelector(state => state.user?.followRequests || [])

    useEffect(() => {
        handleGetFollowRequests()
    }, [])

    console.log(followRequests)

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Notifications</h1>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Follow Requests</h2>

                {followRequests && followRequests.length > 0 ? (
                    <div className={styles.requestsContainer}>
                        {followRequests.map((request) => (
                            <div
                                key={request._id}
                                className={styles.requestCard}
                            >
                                <div className={styles.userInfo}>
                                    <div className={styles.avatar}>
                                        <img
                                            src={request.follower.profilePicture}
                                            alt={request.follower.username}
                                        />
                                    </div>
                                    <div className={styles.userDetails}>
                                        <a href={`/profile/${request.follower.username}`} className={styles.username}>
                                            {request.follower.username}
                                        </a>
                                        <span className={styles.requestText}>requested to follow you</span>
                                    </div>
                                </div>

                                {request.status === "accepted" ? (
                                    <p className={styles.acceptedBadge}>accepted</p>
                                ) : (
                                    <div className={styles.actionButtons}>
                                        <button
                                            onClick={() => {
                                                handleAcceptFollowRequest({ requestId: request._id })
                                            }}
                                            className={styles.acceptBtn}
                                        >
                                            accept
                                        </button>
                                        <button className={styles.rejectBtn}>
                                            reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <p className={styles.emptyText}>No pending follow requests.</p>
                    </div>
                )}
            </div>

            <div className={styles.earlierSection}>
                <h2 className={styles.sectionTitle}>Earlier</h2>
                <div className={styles.emptyState}>
                    <p className={styles.emptyText}>No earlier notifications.</p>
                </div>
            </div>
        </div>
    )
}

export default Notification
