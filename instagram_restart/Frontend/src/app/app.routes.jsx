import React from 'react'
import { createBrowserRouter, } from 'react-router-dom'
import Home from  '../features/posts/pages/Home'
import Login from '../features/auth/pages/Login'
import Register from  '../features/auth/pages/Register' 
import Profile from "../features/posts/pages/Profile"


export const router = createBrowserRouter([
    
{   
    path:'/', 
   element:<Home />
},
{
    path:'/login',
    element:<Login />
},
{
    path:'/register',
    element:<Register />
},
{
    path:'/profile',
    element:<Profile />
}

])
 