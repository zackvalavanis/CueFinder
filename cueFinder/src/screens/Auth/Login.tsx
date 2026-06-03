import { useAuth } from "../Components/useAuth"
import type { LoginPage } from "../../types/types";
import { useState } from "react";
import { useNavigate } from "react-router";

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
          "Content-Type": "application./json"
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

      navigate('/')
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }


  return (
    <div>
      <div>
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
          <button type='submit'>Login</button>

        </form>
      </div>




    </div>
  )
}