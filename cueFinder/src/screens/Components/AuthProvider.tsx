// context/AuthProvider.tsx
import { useState } from "react"
import { AuthContext } from "./AuthContext"
// import type { User } from "../../types/types"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('access_token'))
  // const [user, setUser] = useState<User | null>(null)

  const login = async (newToken: string) => {
    localStorage.setItem('access_token', newToken)
    setToken(newToken)
  }

  return (
    <AuthContext.Provider value={{ login, token }}>
      {children}
    </AuthContext.Provider>
  )
}