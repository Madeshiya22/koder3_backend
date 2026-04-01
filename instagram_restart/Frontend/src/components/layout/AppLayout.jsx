import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../navigation/Sidebar';
import styles from './AppLayout.module.scss';

const AppLayout = () => {
    return (
        <div className={styles.layoutContainer}>
            {/* Navigation (Sidebar Desktop / Bottom Bar Mobile) */}
            <Sidebar />

            {/* Accommodates bottom margin identical to the mobile bottom bar height */}
            <main className={styles.mainContent}>
                <div className={styles.contentWrapper}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AppLayout;
