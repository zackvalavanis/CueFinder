import { Link } from "react-router"
import './Header.css'


export function Header() {
  return (
    <div className='headernav'>
      <div className="nav-bar-container">
        <div className='nav-bar-left'>
          <Link to='/'>Home</Link>
        </div>

        <div className="nav-bar-center">


        </div>

        <div className="nav-bar-right">
          <Link to='/login'>Login</Link>
          <Link to="/sign-up">Logout</Link>
        </div>
      </div>

    </div>
  )
}