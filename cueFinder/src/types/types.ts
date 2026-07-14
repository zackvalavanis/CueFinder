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
  id: string
  token: string | null
  first_name: string
  last_name: string
  email: string
}

export interface PublicUser {
  id: string
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
  preview: string | null
  savedPhotoUrl: string | null
}

export interface PoolTable {
  id: string
  name: string
  address: string
  place_id: string
  rating: number | null
  maps_url: string | null
  lat: number
  lng: number
}

export interface PTablesResponse {
  name: string
  place_id: string
  id: string
  rating: number | null
  table_size: number | null
  location: string
  user_id: string
  maps_url: string | null
}

export interface MatchesResponse {
  id: string
  session_id: string | null
  winner_id: string | null
  played_at: string
  player1: { id: string; first_name: string; last_name: string }
  player2: { id: string; first_name: string; last_name: string }
  p_table: { id: string; name: string | null; location: string } | null
}


export interface Game {
  session_id: string | null
  id: number
  opponent_id: string | null
  winner: string | null
  table_id: string | null
}

export interface Leaderboard {
  id: string
  first_name: string
  last_name: string
  wins: number
  losses: number
}

export interface MatchesModalProps {
  show: boolean
  onClose: () => void
  matches: MatchesResponse[] | null
}


