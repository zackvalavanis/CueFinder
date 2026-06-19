import { Link, useLocation } from "react-router"
import './Header.css'
import { useAuth } from "../Components/useAuth"
import HomeIcon from '@mui/icons-material/Home';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';



export function Header() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div className='headernav'>
      <div className="nav-bar-container">
        <div className="nav-bar-right">
          <Link title='Navigate Home' to='/'><HomeIcon /></Link>
          {isHome ? (
            <a href="#leaderboard"><EmojiEventsIcon /></a>
          ) : (
            <a href="/#leaderboard"><EmojiEventsIcon /></a>
          )}
          {user ? (
            <div className="logged-in-left">
              {isHome ? (
                <a href="#match">Match Play</a>
              ) : (
                <a href="/#match">Match Play</a>
              )}
              <Link title='Navigate to Profile' to='/profile'>Profile</Link>
              <Link title='Logout' onClick={logout} to="/login">Logout</Link>
            </div>
          ) : (
            <div className='logged-in-right' >
              <Link title='Navigate to Login' to='/login'>Log In</Link>
              <Link title='Navigate to Sign Up' to='/sign-up'>Sign Up</Link>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}