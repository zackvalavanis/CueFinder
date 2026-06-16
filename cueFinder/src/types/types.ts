export interface LoginPage {
  email: string
  password: string
}

export interface AuthContextType {
  token: string | null
  login: (token: string) => Promise<void>
  logout: () => void
  isLoading: boolean
  user: User | null
}

export interface User {
  token: string | null
  first_name: string
  last_name: string
}

export interface SignupPage {
  first_name: string
  last_name: string
  email: string
  password: string
}

export interface ProfileModal {
  show: boolean
  onClose: () => void
  uploadPhoto: (e: React.FormEvent) => void
  changeFile: (e: React.ChangeEvent<HTMLInputElement>) => void
  loading: boolean
}