'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/lib/stores/auth-store'
import api from '@/lib/api'

export function AuthInitializer() {
  const { updateUser, token, isAuthenticated } = useAuthStore()

  useEffect(() => {
    const fetchUser = async () => {
      if (token && isAuthenticated) {
        try {
          const res = await api.get('/auth/me')
          if (res?.data) {
            updateUser(res.data)
          }
        } catch (error) {
          // Clean silent fallback for demo mode
        }
      }
    }

    fetchUser()
  }, [token, isAuthenticated, updateUser])

  return null // This component doesn't render anything
}
