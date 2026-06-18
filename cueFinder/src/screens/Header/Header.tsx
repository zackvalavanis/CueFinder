import { Link } from "react-router"
import './Header.css'
import { useAuth } from "../Components/useAuth"
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import VpnKeyIcon from '@mui/icons-material/VpnKey';



export function Header() {
  const { user, logout } = useAuth()

  return (
    <div className='headernav'>
      <div className="nav-bar-container">
        <div className="nav-bar-right">
          <Link title='Navigate Home' to='/'><HomeIcon /></Link>
          {user ? (
            <div className="logged-in-left">
              <Link title='Navigate to Profile' to='/profile'><AccountBoxIcon /></Link>
              <Link title='Logout' onClick={logout} to="/login"><LogoutIcon /></Link>
            </div>
          ) : (
            <div className='logged-in-right' >
              <Link title='Navigate to Login' to='/login'><VpnKeyIcon /></Link>
              <Link title='Navigate to Sign Up' to='/sign-up'>Sign Up</Link>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}