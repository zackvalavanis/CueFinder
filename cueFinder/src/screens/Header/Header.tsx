import { Link } from "react-router"
import './Header.css'
import { useAuth } from "../Components/useAuth"


export function Header() {
  const { user, logout } = useAuth()

  return (
    <div className='headernav'>
      <div className="nav-bar-container">
        <div className='nav-bar-left'>
          <Link to='/'>Home</Link>
        </div>

        <div className="nav-bar-center">


        </div>

        <div className="nav-bar-right">
          {user ? (
            <div className="logged-in-left">
              <Link onClick={logout} to="/login">Logout</Link>
              <Link to='/profile'>Profile</Link>
            </div>
          ) : (
            <div className='logged-in-right' >
              <Link to='/login'>Login</Link>
              <Link to='/sign-up'>Sign Up</Link>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}