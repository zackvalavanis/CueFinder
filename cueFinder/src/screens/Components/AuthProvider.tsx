// context/AuthProvider.tsx
import { useEffect, useState } from "react"
import { AuthContext } from "./AuthContext"
import type { User } from "../../types/types"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('access_token'))
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)


  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setIsLoading(false)
        return
      }


      try {
        const res = await fetch("http://localhost:8000/users/me", {
          headers: {
            "Authorication": `Bearer ${token}`
          }
        })
        if (res.ok) {
          const userData = await res.json()
          setUser(userData)
        } else {
          localStorage.removeItem('access_token')
          setToken(null)
        }
      } catch (error) {
        console.error("Failed to fetch user", error)
        localStorage.removeItem('access_token')
        setToken(null)
      }
      finally {
        setIsLoading(false)
      }
    }
    fetchUser()
  }, [token])


  const login = async (newToken: string) => {
    localStorage.setItem('access_token', newToken)
    setToken(newToken)
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ login, token, logout, isLoading, user }}>
      {children}
    </AuthContext.Provider>
  )
}