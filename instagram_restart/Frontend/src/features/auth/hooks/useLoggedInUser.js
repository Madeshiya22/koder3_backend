import { useSelector } from 'react-redux';

/**
 * Hook: Logged-in user ke profile ko fetch karne ke liye
 * Ye hook Redux store se current user ki info return karta hai
 * Agar user login hai to uska data milta hai, nahi to null
 */
export const useLoggedInUser = () => {
    // Redux store se current logged-in user ki info nikaal rahe hain
    const user = useSelector((store) => store.auth?.user);

    // Agar user ke pass profilePicture nahi hai to
    // default avatar generate kar rahe hain username ke initials/first letter se
    const getProfilePicture = () => {
        if (user?.profilePicture) {
            return user.profilePicture;
        }
        
        // Agar koi bhi profile picture nahi hai to
        // ui-avatars service se dynamic avatar generate kar rahe hain
        const displayName = user?.fullname || user?.username || 'User';
        return `https://ui-avatars.com/api/?name=${displayName}&background=ebeeef&color=5e5e5e&bold=true`;
    };

    return {
        // User ka pura data
        user,
        // Default avatar ke saath profile picture
        profilePicture: getProfilePicture(),
        // Username
        username: user?.username,
        // Full name
        fullname: user?.fullname,
        // Check karne ke liye ki user login hai ya nahi
        isLoggedIn: !!user
    };
};
