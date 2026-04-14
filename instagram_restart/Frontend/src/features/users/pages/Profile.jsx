import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { LogOut, Grid3x3, Video, Bookmark, Tag, MoreHorizontal } from 'lucide-react'
import styles from './Profile.module.scss'
import { setUser } from '../../auth/auth.slice'
import { getUserProfileData, getUserPosts, getUserVideos, getBookmarkedPosts, updateProfile } from '../../profiles/services/profile.api'
import PostGrid from '../../profiles/components/PostGrid'

const Profile = () => {
    const user = useSelector((store) => store.auth.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [profileData, setProfileData] = useState(null)
    const [posts, setPosts] = useState([])
    const [videos, setVideos] = useState([])
    const [bookmarks, setBookmarks] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('posts')
    const [isEditing, setIsEditing] = useState(false)
    const [editForm, setEditForm] = useState({ fullname: '', bio: '' })
    const [profileImageFile, setProfileImageFile] = useState(null)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (user?._id) {
            fetchProfileData()
        }
    }, [user?._id])

    // Fetch different content based on active tab
    useEffect(() => {
        if (!user?._id) return
        
        if (activeTab === 'posts') {
            fetchPosts()
        } else if (activeTab === 'videos') {
            fetchVideos()
        } else if (activeTab === 'bookmarks') {
            fetchBookmarks()
        }
    }, [activeTab, user?._id])

    const fetchProfileData = async () => {
        try {
            setLoading(true)
            const data = await getUserProfileData({ userId: user._id })
            setProfileData(data)
            setEditForm({
                fullname: data.fullname || user.fullname || '',
                bio: data.bio || user.bio || ''
            })
        } catch (error) {
            console.error('Error fetching profile:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchPosts = async () => {
        try {
            const data = await getUserPosts({ userId: user._id, page: 1 })
            setPosts(data.posts || [])
        } catch (error) {
            console.error('Error fetching posts:', error)
            setPosts([])
        }
    }

    const fetchVideos = async () => {
        try {
            const data = await getUserVideos({ userId: user._id, page: 1 })
            setVideos(data.posts || [])
        } catch (error) {
            console.error('Error fetching videos:', error)
            setVideos([])
        }
    }

    const fetchBookmarks = async () => {
        try {
            const data = await getBookmarkedPosts({ page: 1 })
            setBookmarks(data.posts || [])
        } catch (error) {
            console.error('Error fetching bookmarks:', error)
            setBookmarks([])
        }
    }

    const getInitials = () => {
        if (user?.fullname) {
            return user.fullname
                .split(' ')
                .map(n => n.charAt(0))
                .join('')
                .toUpperCase()
                .slice(0, 2)
        }
        return user?.username?.charAt(0).toUpperCase() || 'U'
    }

    const handleLogout = () => {
        dispatch(setUser(null))
        navigate('/login')
    }

    const handleProfileSave = async (event) => {
        event.preventDefault()
        try {
            setSaving(true)
            const response = await updateProfile({
                fullname: editForm.fullname,
                bio: editForm.bio,
                profileImage: profileImageFile
            })
            dispatch(setUser(response.user))
            setProfileData((previous) => ({
                ...previous,
                ...response.user
            }))
            setIsEditing(false)
            setProfileImageFile(null)
        } catch (error) {
            console.error('Error updating profile:', error)
        } finally {
            setSaving(false)
        }
    }

    if (!user) {
        return (
            <div className={styles.profileContainer}>
                <div className={styles.emptyState}>
                    <p>Please log in to view your profile</p>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.profileContainer}>
            {/* Profile Header */}
            <div className={styles.profileHeader}>
                {/* Avatar */}
                <div className={styles.avatarSection}>
                    <div className={styles.avatarLarge}>
                            {user?.profileImage || user?.profilePicture ? (
                            <img 
                                    src={user.profileImage || user.profilePicture} 
                                alt={user.username}
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
                        <h1 className={styles.username}>{user?.username}</h1>
                        <button className={styles.moreBtn} title="More options">
                            <MoreHorizontal size={24} />
                        </button>
                    </div>

                    {/* Stats in one line */}
                    <div className={styles.statsLine}>
                        <span><strong>{profileData?.posts || 0}</strong> posts</span>
                        <span><strong>{profileData?.followers || 0}</strong> followers</span>
                        <span><strong>{profileData?.following || 0}</strong> following</span>
                    </div>

                    {/* Name and Bio */}
                    <div className={styles.bioSection}>
                        <p className={styles.fullname}>{user?.fullname || 'User'}</p>
                        <p className={styles.bio}>{profileData?.bio || 'Enjoy every moment of life'}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className={styles.actionButtons}>
                        <button className={styles.editBtn} onClick={() => setIsEditing((previous) => !previous)}>
                            Edit profile
                        </button>
                        <button className={styles.viewArchiveBtn} onClick={handleLogout}>
                            <LogOut size={16} /> Logout
                        </button>
                        <button className={styles.viewArchiveBtn}>
                            View archive
                        </button>
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

            {isEditing && (
                <form className={styles.editPanel} onSubmit={handleProfileSave}>
                    <div className={styles.editRow}>
                        <label className={styles.editLabel}>Display name</label>
                        <input
                            className={styles.editInput}
                            value={editForm.fullname}
                            onChange={(event) => setEditForm((previous) => ({ ...previous, fullname: event.target.value }))}
                        />
                    </div>
                    <div className={styles.editRow}>
                        <label className={styles.editLabel}>Bio</label>
                        <textarea
                            className={styles.editTextarea}
                            rows={4}
                            value={editForm.bio}
                            onChange={(event) => setEditForm((previous) => ({ ...previous, bio: event.target.value }))}
                        />
                    </div>
                    <div className={styles.editRow}>
                        <label className={styles.editLabel}>Profile image</label>
                        <input
                            className={styles.editFile}
                            type="file"
                            accept="image/*"
                            onChange={(event) => setProfileImageFile(event.target.files?.[0] || null)}
                        />
                    </div>
                    <div className={styles.editActions}>
                        <button className={styles.saveBtn} type="submit" disabled={saving}>
                            {saving ? 'Saving...' : 'Save changes'}
                        </button>
                        <button className={styles.cancelBtn} type="button" onClick={() => setIsEditing(false)}>
                            Cancel
                        </button>
                    </div>
                </form>
            )}

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
                <button 
                    className={`${styles.tabButton} ${activeTab === 'bookmarks' ? styles.active : ''}`}
                    onClick={() => setActiveTab('bookmarks')}
                    title="Bookmarks"
                >
                    <Bookmark size={20} />
                </button>
                <button 
                    className={`${styles.tabButton} ${activeTab === 'tagged' ? styles.active : ''}`}
                    onClick={() => setActiveTab('tagged')}
                    title="Tagged"
                >
                    <Tag size={20} />
                </button>
            </div>

            {/* Content Grid based on active tab */}
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

export default Profile
