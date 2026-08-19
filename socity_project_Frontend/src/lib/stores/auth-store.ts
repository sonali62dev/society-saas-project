import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  _hasHydrated: boolean
  setHasHydrated: (state: boolean) => void
  login: (user: User, token: string) => void
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

// Synchronously load from localStorage before any React rendering starts
let initialUser: User | null = null
let initialToken: string | null = null
let initialIsAuthenticated = false

if (typeof window !== 'undefined') {
  const data = localStorage.getItem('auth-storage')
  if (data) {
    try {
      const parsed = JSON.parse(data)
      if (parsed?.state) {
        initialUser = parsed.state.user || null
        initialToken = parsed.state.token || null
        initialIsAuthenticated = !!parsed.state.isAuthenticated
      }
    } catch (e) {
      // ignore
    }
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: initialUser,
      token: initialToken,
      isAuthenticated: initialIsAuthenticated,
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      login: (user, token) => {
        set({ user, token, isAuthenticated: true })
        if (typeof window !== 'undefined') {
          localStorage.setItem(
            'auth-storage',
            JSON.stringify({
              state: { user, token, isAuthenticated: true }
            })
          )
        }
      },
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-storage')
        }
      },
      updateUser: (userData) =>
        set((state) => {
          const updatedUser = state.user ? { ...state.user, ...userData } : null
          if (typeof window !== 'undefined' && updatedUser) {
            localStorage.setItem(
              'auth-storage',
              JSON.stringify({
                state: { user: updatedUser, token: state.token, isAuthenticated: state.isAuthenticated }
              })
            )
          }
          return { user: updatedUser }
        }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: (state) => {
        return (hydratedState, error) => {
          if (!error && hydratedState) {
            hydratedState.setHasHydrated(true)
          }
        }
      },
    }
  )
)

