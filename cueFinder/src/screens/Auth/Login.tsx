import { useAuth } from "../Components/useAuth"
import type { LoginPage } from "../../types/types";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify"
import './Login.css'
import { Eye, EyeOff } from 'lucide-react'

export function Login() {
  const api = import.meta.env.VITE_BACKEND_API
  const { login } = useAuth();
  const navigate = useNavigate()
  const [formData, setFormData] = useState<LoginPage>({
    "email": "",
    "password": ""
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const handleLogin = async (formData: LoginPage) => {
    setLoading(true)

    try {
      const res = await fetch(`${api}/auth/login`, {
        "method": "POST",
        "headers": {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      })
      const data = await res.json()

      if (!res.ok) {
        console.error("There was an error")
        toast.error("Error failed to log in")
        return
      }

      if (!data?.access_token) {
        toast.error("No token returned from the server")
        return
      }

      login(data.access_token)
      toast.success(`Logged in Successfully ${data.first_name}`)

      navigate('/')
    } catch (error) {
      console.error(error)
      toast.error("Login failed, please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='login-page'>
      <div className="left-side-login">
        <h1>Login to Save Your Favorite Tables</h1>
      </div>



      <div className="right-side-login">

        <div className='login-form'>
          <form onSubmit={(e) => {
            e.preventDefault()
            handleLogin(formData)
          }}>

            <input
              className="email-input"
              name='email'
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}>
            </input>
            <div className="input-wrapper">
              <input
                name='password'
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}>
              </input>
              <button type='button' className='eye-toggle' onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
            </div>
            <div className='login-buttons-container'>
              <button className='login-button' type='submit' disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
              <span className="auth-divider">or</span>
              <button
                className="google-btn"
                onClick={() => window.location.href = `${api}/auth/google`}
              >
                <img src="https://www.google.com/favicon.ico" width="16" height="16" />
                Sign in with Google
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}