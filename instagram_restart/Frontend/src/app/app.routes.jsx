import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import Home from '../features/posts/pages/Home'
import Login from '../features/auth/pages/Login'
import Register from '../features/auth/pages/Register'
import Profile from "../features/users/pages/Profile"
import UserProfile from "../features/profiles/pages/UserProfile"
import CreatePost from "../features/posts/pages/CreatePost"
import AppLayout from "../components/layout/AppLayout"
import Search from "../features/users/pages/Search"
import Notification from "../features/users/pages/Notification"    

export const router = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout />,
        children: [
            {
                path: '/',
                element: <Home />
            },
            {
                path: '/profile',
                element: <Profile />
            },
            {
                path: '/profile/:userId',
                element: <UserProfile />
            },
            {
                path: '/create',
                element: <CreatePost />
            },{
                path: '/search',
                element: <Search />            },
            {
                path: '/notifications',
                element: <Notification />            }
        ]
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    }
])