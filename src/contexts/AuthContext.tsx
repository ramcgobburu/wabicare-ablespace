"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

interface AuthContextType {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let timeout: NodeJS.Timeout
    let subscription: any

    // Get initial session with a shorter timeout
    const getInitialSession = async () => {
      try {
        // Set a very short timeout for the initial session check
        const sessionPromise = supabase.auth.getSession()
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session timeout')), 2000)
        )
        
        const { data: { session } } = await Promise.race([sessionPromise, timeoutPromise]) as any
        setUser(session?.user ?? null)
        setLoading(false)
      } catch (error) {
        console.error('Error getting initial session:', error)
        
        // If it's a refresh token error, clear the session and sign out
        if (error instanceof Error && error.message.includes('Invalid Refresh Token')) {
          console.log('Clearing invalid refresh token...')
          await supabase.auth.signOut()
        }
        
        setLoading(false)
      }
    }

    getInitialSession()

    // Add a shorter timeout to prevent infinite loading
    timeout = setTimeout(() => {
      console.log('Auth timeout reached, setting loading to false')
      setLoading(false)
    }, 3000) // 3 second timeout

    // Listen for auth changes
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id)
        
        // Handle token refresh errors
        if (event === 'TOKEN_REFRESHED' && !session) {
          console.log('Token refresh failed, clearing session...')
          await supabase.auth.signOut()
        }
        
        setUser(session?.user ?? null)
        setLoading(false)
        if (timeout) clearTimeout(timeout)
      }
    )

    subscription = authSubscription

    return () => {
      if (subscription) subscription.unsubscribe()
      if (timeout) clearTimeout(timeout)
    }
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const value = {
    user,
    loading,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
