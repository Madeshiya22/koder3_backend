import React from 'react'
import styles from '../pages/UserProfile.module.scss'

const ProfileSkeleton = () => {
    return (
        <div className={styles.profileContainer}>
            <div style={{
                display: 'flex',
                gap: '40px',
                paddingBottom: '40px',
                borderBottom: '1px solid #dbdbdb',
                animation: 'pulse 1.5s ease-in-out infinite'
            }}>
                {/* Avatar skeleton */}
                <div style={{
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    background: '#e9ecef',
                    flexShrink: 0
                }} />
                
                {/* Info skeleton */}
                <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', width: '100%'}}>
                    <div style={{
                        height: '32px',
                        width: '200px',
                        background: '#e9ecef',
                        borderRadius: '4px'
                    }} />
                    <div style={{
                        height: '16px',
                        width: '300px',
                        background: '#e9ecef',
                        borderRadius: '4px'
                    }} />
                    <div style={{
                        height: '16px',
                        width: '150px',
                        background: '#e9ecef',
                        borderRadius: '4px'
                    }} />
                    <div style={{
                        display: 'flex',
                        gap: '12px',
                        marginTop: '10px'
                    }}>
                        <div style={{
                            height: '32px',
                            width: '100px',
                            background: '#e9ecef',
                            borderRadius: '4px'
                        }} />
                        <div style={{
                            height: '32px',
                            width: '100px',
                            background: '#e9ecef',
                            borderRadius: '4px'
                        }} />
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 0.6; }
                    50% { opacity: 1; }
                }
            `}</style>
        </div>
    )
}

export default ProfileSkeleton
