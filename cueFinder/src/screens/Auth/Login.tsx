import { useAuth } from "../Components/useAuth"
import type { LoginPage } from "../../types/types";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify"
import './Login.css'

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate()
  const [formData, setFormData] = useState<LoginPage>({
    "email": "",
    "password": ""
  })
  const [loading, setLoading] = useState(false)

  const handleLogin = async (formData: LoginPage) => {
    setLoading(true)

    try {
      const res = await fetch("http://localhost:8000/auth/login", {
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
        return
      }

      if (!data?.access_token) {
        console.log("No token returned from the server")
        return
      }

      console.log("LOGIN SUCCESS", data)
      login(data.access_token)
      toast.success(`Logged in Successfully ${data.email}`)

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
      <h1>Login to Save Your Favorite Tables</h1>
      <div className='login-form'>
        <form onSubmit={(e) => {
          e.preventDefault()
          handleLogin(formData)
        }}>

          <input
            name='email'
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}>
          </input>

          <input
            name='password'
            type='password'
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}>
          </input>
          <button>Log in with Apple</button>
          <button>Log in with Google</button>
          <button type='submit'>Login</button>

        </form>
      </div>
    </div>
  )
}