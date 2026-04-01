import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import Home from  '../features/posts/pages/Home'
import Login from '../features/auth/pages/Login'
import Register from  '../features/auth/pages/Register' 
import Profile from "../features/posts/pages/Profile"
import CreatePost from "../features/posts/pages/CreatePost"
import AppLayout from "../components/layout/AppLayout"

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
                path: '/create',
                element: <CreatePost />
            }
        ]
    },
    {
        path:'/login',
        element:<Login />
    },
    {
        path:'/register',
        element:<Register />
    }
])