import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Grid3x3, Video, Bookmark, Tag, MoreHorizontal, User, UserCheck, UserPlus } from 'lucide-react'
import styles from './UserProfile.module.scss'
import { getUserProfileData, getUserPosts, getUserVideos, getBookmarkedPosts } from '../services/profile.api'
import { followUser } from '../../users/service/users.api'
import ProfileSkeleton from '../components/ProfileSkeleton'
import PostGrid from '../components/PostGrid'

const UserProfile = () => {
    const { userId } = useParams()
    const navigate = useNavigate()
    const currentUser = useSelector((store) => store.auth.user)
    
    const [profileData, setProfileData] = useState(null)
    const [posts, setPosts] = useState([])
    const [videos, setVideos] = useState([])
    const [bookmarks, setBookmarks] = useState([])
    const [activeTab, setActiveTab] = useState('posts')
    const [loading, setLoading] = useState(true)
    const [following, setFollowing] = useState(false)
    const [postsPage, setPostsPage] = useState(1)
    const [videosPage, setVideosPage] = useState(1)
    const [bookmarksPage, setBookmarksPage] = useState(1)

    // Fetch profile data
    useEffect(() => {
        fetchProfileData()
    }, [userId])

    // Fetch posts when tab changes
    useEffect(() => {
        if (activeTab === 'posts') {
            fetchPosts()
        } else if (activeTab === 'videos') {
            fetchVideos()
        } else if (activeTab === 'bookmarks' && currentUser?._id === userId) {
            fetchBookmarks()
        }
    }, [activeTab, userId])

    const fetchProfileData = async () => {
        try {
            setLoading(true)
            const data = await getUserProfileData({ userId })
            setProfileData(data)
            setFollowing(data.followStatus === 'accepted' || data.followStatus === 'pending')
        } catch (error) {
            console.error('Error fetching profile:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchPosts = async () => {
        try {
            const data = await getUserPosts({ userId, page: postsPage })
            setPosts(data.posts)
        } catch (error) {
            console.error('Error fetching posts:', error)
            setPosts([])
        }
    }

    const fetchVideos = async () => {
        try {
            const data = await getUserVideos({ userId, page: videosPage })
            setVideos(data.posts)
        } catch (error) {
            console.error('Error fetching videos:', error)
            setVideos([])
        }
    }

    const fetchBookmarks = async () => {
        try {
            const data = await getBookmarkedPosts({ page: bookmarksPage })
            setBookmarks(data.posts)
        } catch (error) {
            console.error('Error fetching bookmarks:', error)
            setBookmarks([])
        }
    }

    const handleFollowClick = async () => {
        try {
            await followUser({ userId })
            setFollowing(!following)
            fetchProfileData()
        } catch (error) {
            console.error('Error toggling follow:', error)
        }
    }

    const isOwnProfile = currentUser?._id === userId
    const isFollowing = following

    if (loading) {
        return <ProfileSkeleton />
    }

    if (!profileData) {
        return (
            <div className={styles.profileContainer}>
                <div className={styles.emptyState}>
                    <p>User not found</p>
                </div>
            </div>
        )
    }

    const getInitials = () => {
        if (profileData?.fullname) {
            return profileData.fullname
                .split(' ')
                .map(n => n.charAt(0))
                .join('')
                .toUpperCase()
                .slice(0, 2)
        }
        return profileData?.username?.charAt(0).toUpperCase() || 'U'
    }

    return (
        <div className={styles.profileContainer}>
            {/* Profile Header */}
            <div className={styles.profileHeader}>
                {/* Avatar */}
                <div className={styles.avatarSection}>
                    <div className={styles.avatarLarge}>
                        {profileData?.profilePicture ? (
                            <img 
                                src={profileData.profilePicture} 
                                alt={profileData.username}
                                className={styles.avatarImage}
                            />
                        ) : (
                            <span className={styles.initials}>{getInitials()}</span>
                        )}
                    </div>
                </div>

                {/* User Info */}
                <div className={styles.userInfoSection}>
                    <div className={styles.usernameRow}>
                        <h1 className={styles.username}>{profileData?.username}</h1>
                        <button className={styles.moreBtn} title="More options">
                            <MoreHorizontal size={24} />
                        </button>
                    </div>

                    {/* Stats */}
                    <div className={styles.statsLine}>
                        <span><strong>{profileData?.posts || 0}</strong> posts</span>
                        <span><strong>{profileData?.followers || 0}</strong> followers</span>
                        <span><strong>{profileData?.following || 0}</strong> following</span>
                    </div>

                    {/* Name and Bio */}
                    <div className={styles.bioSection}>
                        <p className={styles.fullname}>{profileData?.fullname}</p>
                        {profileData?.bio && <p className={styles.bio}>{profileData.bio}</p>}
                    </div>

                    {/* Action Buttons */}
                    <div className={styles.actionButtons}>
                        {isOwnProfile ? (
                            <>
                                <button className={styles.editBtn}>
                                    Edit profile
                                </button>
                                <button className={styles.viewArchiveBtn}>
                                    View archive
                                </button>
                            </>
                        ) : (
                            <>
                                <button 
                                    className={`${styles.followBtn} ${isFollowing ? styles.following : ''}`}
                                    onClick={handleFollowClick}
                                >
                                    {isFollowing ? (
                                        <>
                                            <UserCheck size={16} /> Following
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus size={16} /> Follow
                                        </>
                                    )}
                                </button>
                                <button className={styles.messageBtn}>
                                    Message
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Highlights */}
            <div className={styles.highlightsSection}>
                <div className={styles.highlight}>
                    <div className={styles.highlightImage} style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
                        <span className={styles.highlightLabel}>+</span>
                    </div>
                    <span className={styles.highlightName}>New</span>
                </div>
            </div>

            {/* Tabs */}
            <div className={styles.tabsSection}>
                <button 
                    className={`${styles.tabButton} ${activeTab === 'posts' ? styles.active : ''}`}
                    onClick={() => setActiveTab('posts')}
                    title="Posts"
                >
                    <Grid3x3 size={20} />
                </button>
                <button 
                    className={`${styles.tabButton} ${activeTab === 'videos' ? styles.active : ''}`}
                    onClick={() => setActiveTab('videos')}
                    title="Videos"
                >
                    <Video size={20} />
                </button>
                {isOwnProfile && (
                    <button 
                        className={`${styles.tabButton} ${activeTab === 'bookmarks' ? styles.active : ''}`}
                        onClick={() => setActiveTab('bookmarks')}
                        title="Bookmarks"
                    >
                        <Bookmark size={20} />
                    </button>
                )}
                <button 
                    className={`${styles.tabButton} ${activeTab === 'tagged' ? styles.active : ''}`}
                    onClick={() => setActiveTab('tagged')}
                    title="Tagged"
                >
                    <Tag size={20} />
                </button>
            </div>

            {/* Content Grid */}
            <PostGrid 
                posts={
                    activeTab === 'posts' ? posts : 
                    activeTab === 'videos' ? videos : 
                    activeTab === 'bookmarks' ? bookmarks : 
                    []
                }
                tab={activeTab}
            />
        </div>
    )
}

export default UserProfile
