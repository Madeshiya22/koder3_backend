import React, { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUser } from '../features/auth/auth.slice'
import { router } from './app.routes.jsx'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000'

const App = () => {
  const dispatch = useDispatch()

  // Restore user on app load
  useEffect(() => {
    const restoreUser = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/auth/me`, {
          withCredentials: true
        })
        if (response.data?.user) {
          dispatch(setUser(response.data.user))
        }
      } catch (error) {
        console.log('No active session')
      }
    }

    restoreUser()
  }, [dispatch])

  return (
    <RouterProvider router={router} />
  )
}

export default App