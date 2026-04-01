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
import { useSelector } from 'react-redux';
import styles from './Sidebar.module.scss';

const Sidebar = () => {
    const user = useSelector((store) => store.auth?.user);

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
            {/* Desktop Sidebar (Slim, Icon-Only with Tooltips) */}
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
                                                <div style={{
                                                  width: '26px', height: '26px', borderRadius: '50%', 
                                                  border: isActive ? '2px solid white' : '1px solid #444',
                                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                  overflow: 'hidden'
                                                }}>
                                                    {user?.profilePicture ? (
                                                        <img src={user.profilePicture} alt="Profile" className={styles.profileImage} style={{width:'100%', height:'100%', objectFit:'cover'}} />
                                                    ) : (
                                                        <span style={{fontSize: '10px'}}>{user?.username?.[0]?.toUpperCase() || 'U'}</span>
                                                    )}
                                                </div>
                                            ) : (
                                                <Icon strokeWidth={isActive ? 2.5 : 1.5} size={26} />
                                            )}
                                            {item.badge && (
                                                <span className={styles.badge}>{item.badge}</span>
                                            )}
                                        </div>
                                        <span className={styles.tooltip}>
                                            {item.name}
                                        </span>
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
                        <span className={styles.tooltip}>More</span>
                    </button>
                    <button className={styles.navLink}>
                        <div className={styles.iconWrapper}>
                            <Grid strokeWidth={1.5} size={26} />
                        </div>
                        <span className={styles.tooltip}>Threads</span>
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
                                    <div style={{
                                        width: '26px', height: '26px', borderRadius: '50%', 
                                        border: isActive ? '2px solid white' : '1px solid #444',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        overflow: 'hidden'
                                    }}>
                                        {user?.profilePicture ? (
                                            <img src={user.profilePicture} alt="Profile" style={{width:'100%', height:'100%', objectFit:'cover'}} />
                                        ) : (
                                            <span style={{fontSize: '10px'}}>{user?.username?.[0]?.toUpperCase() || 'U'}</span>
                                        )}
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
