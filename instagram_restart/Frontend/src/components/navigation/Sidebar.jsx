import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    Home,
    Search,
    PlusSquare,
    Heart,
    MessageCircle,
    Compass,
    PlaySquare,
    Menu,
    Grid
} from 'lucide-react';

const InstagramIcon = ({ size = 28 }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
);
import { useLoggedInUser } from '../../features/auth/hooks/useLoggedInUser';
import styles from './Sidebar.module.scss';

/**
 * Feature: Logged-in User Profile Display in Sidebar
 * Ye component sidebar mein current user ka profile picture dikhata hai
 * Agar profile picture nahi hai to dynamic avatar (username ke initials se) generate hota hai
 * Ye sab hooks ke through dynamic hai, hard-coded nahi hai
 */
const Sidebar = () => {
    // Logged-in user ka profile data fetch kar rahe hain custom hook se
    const { profilePicture, username } = useLoggedInUser();

    // Arranged to perfectly match the sleek sidebar image provided
    const navItems = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Reels', path: '/reels', icon: PlaySquare },
        { name: 'Messages', path: '/messages', icon: MessageCircle, badge: 4 },
        { name: 'Search', path: '/search', icon: Search },
        { name: 'Explore', path: '/explore', icon: Compass },
        { name: 'Notifications', path: '/notifications', icon: Heart },
        { name: 'Create', path: '/create', icon: PlusSquare },
        { name: 'Profile', path: '/profile', isProfile: true },
    ];

    return (
        <>
            {/* Desktop Sidebar (Expandable on hover) */}
            <nav className={styles.desktopNav}>
                <div className={styles.logoIcon}>
                    <InstagramIcon size={28} />
                </div>

                <div className={styles.navItems}>
                    {navItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                className={({ isActive }) =>
                                    `${styles.navLink} ${isActive ? styles.active : ''}`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <div className={styles.iconWrapper}>
                                            {item.isProfile ? (
                                                <div className={`${styles.profilePicContainer} ${isActive ? styles.active : ''}`}>
                                                    {/* 
                                                        Profile Picture Display
                                                        Agar user ke pass proper profile picture hai to vo show hota hai
                                                        Nahi to default avatar ui-avatars.com se generate hota hai
                                                    */}
                                                    <img 
                                                        src={profilePicture} 
                                                        alt={username} 
                                                        className={styles.profileImage} 
                                                    />
                                                </div>
                                            ) : (
                                                <Icon strokeWidth={isActive ? 2.5 : 1.5} size={26} />
                                            )}
                                            {item.badge && (
                                                <span className={styles.badge}>{item.badge}</span>
                                            )}
                                        </div>
                                        <span className={styles.navText}>{item.name}</span>
                                    </>
                                )}
                            </NavLink>
                        );
                    })}
                </div>

                <div className={styles.bottomItems}>
                    <button className={styles.navLink}>
                        <div className={styles.iconWrapper}>
                            <Menu strokeWidth={1.5} size={26} />
                        </div>
                        <span className={styles.navText}>More</span>
                    </button>
                    <button className={styles.navLink}>
                        <div className={styles.iconWrapper}>
                            <Grid strokeWidth={1.5} size={26} />
                        </div>
                        <span className={styles.navText}>Threads</span>
                    </button>
                </div>
            </nav>

            {/* Mobile Bottom Navigation (Visible on <768px screens) */}
            <nav className={styles.mobileNav}>
                {navItems.filter(item => ['Home', 'Search', 'Create', 'Messages', 'Profile'].includes(item.name)).map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) =>
                                `${styles.mobileLink} ${isActive ? styles.active : ''}`
                            }
                        >
                            {({ isActive }) => (
                                item.isProfile ? (
                                    <div className={`${styles.profilePicContainer} ${isActive ? styles.active : ''}`}>
                                        {/* 
                                            Mobile Profile Picture Display
                                            Mobile view ke liye bhi same dynamic profile picture show hota hai
                                        */}
                                        <img 
                                            src={profilePicture} 
                                            alt={username} 
                                            className={styles.profileImage} 
                                        />
                                    </div>
                                ) : (
                                    <Icon strokeWidth={isActive ? 2.5 : 1.5} size={26} />
                                )
                            )}
                        </NavLink>
                    );
                })}
            </nav>
        </>
    );
};

export default Sidebar;
