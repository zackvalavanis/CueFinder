// context/AuthContext.ts
import { createContext } from "react"

export interface AuthContextType {
  token: string | null
  setToken: (token: string | null) => void
}

export const AuthContext = createContext<AuthContextType | null>(null)