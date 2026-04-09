import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../hooks/useUser'
import { useSelector } from 'react-redux'
import styles from './SearchUserTile.module.scss'

const SearchUserTile = ({ user }) => {
    console.log(user)
    const navigate = useNavigate()
    const { handleFollowUser } = useUser()
    const requested = useSelector(state => state.user.requested)
    const currentUser = useSelector(state => state.auth.user)

    const handleFollowClick = async (e, userId) => {
        e.stopPropagation()
        await handleFollowUser({ userId })
    }

    const handleUserClick = () => {
        navigate(`/profile/${user._id}`)
    }

    return (
        <div className={styles.tileContainer} onClick={handleUserClick}>
            <div className={styles.userInfo}>
                <div className={styles.avatarContainer}>
                    <img
                        src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.username || 'User'}&background=ebeeef&color=5e5e5e`}
                        alt={user.username}
                    />
                </div>
                <div className={styles.textInfo}>
                    <span className={styles.username}>
                        {user.username}
                    </span>
                    {user.fullname && (
                        <span className={styles.fullname}>
                            {user.fullname}
                        </span>
                    )}
                </div>
            </div>

            {user.username !== currentUser.username ? (<button 
                onClick={(e) => handleFollowClick(e, user._id)}
                className={styles.followButton}>
                  {requested.includes(user._id) || user.followStatus == "requested" ? "requested" : (user.followStatus == "following" ? "following" : "follow")}
            </button>) : null}
        </div>
    )
}

export default SearchUserTile
