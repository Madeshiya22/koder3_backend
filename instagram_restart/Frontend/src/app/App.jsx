import React, { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUser } from '../features/auth/auth.slice'
import { router } from './app.routes.jsx'
import axios from 'axios'
import { useState } from 'react'

const API_BASE_URL = 'http://localhost:3000'

const App = () => {
  const dispatch = useDispatch()
  const [ready, setReady] = useState(false)

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
      } finally {
        setReady(true)
      }
    }

    restoreUser()
  }, [dispatch])

  if (!ready) {
    return <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', color: '#fff', background: '#000' }}>Loading...</div>
  }

  return (
    <RouterProvider router={router} />
  )
}

export default App