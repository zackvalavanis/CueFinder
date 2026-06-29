import { useState } from "react"
import { Eye, EyeOff } from 'lucide-react'
import './SignUp.css'
import type { SignupPage } from "../../types/types"
import { toast } from "react-toastify"
import { useNavigate } from "react-router"

export function SignUp() {
  const api = import.meta.env.VITE_BACKEND_API
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [formData, setFormData] = useState<SignupPage>({
    "first_name": "",
    "last_name": "",
    "email": "",
    "password": ""
  })

  const handleSignUp = async (formData: SignupPage) => {
    setIsLoading(true)

    try {
      const res = await fetch(`${api}/users`, {
        "method": "POST",
        "headers": {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          password: formData.password
        })
      })

      if (!res.ok) {
        toast.error("There was an error on signup")
        return
      }

      toast.success("You have successfully signed up!")

      navigate('/login')
    } catch (error) {
      console.error("Error on sign up", error)
    }
  }

  return (
    <div className='signup-page'>
      <form onSubmit={(e) => {
        e.preventDefault()
        handleSignUp(formData)
      }}
        className='signup-form'>
        <div className='signup-inputs'>
          <input
            type='text'
            name='first_name'
            placeholder="First Name"
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}>
          </input>
          <input
            type='text'
            name='last_name'
            placeholder="Last Name"
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}></input>
          <input
            type='email'
            name='email'
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          ></input>
        </div>
        <div className='input-wrapper'>
          <input
            name='password'
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}>
          </input>
          <button className='eye-toggle' type='button' onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <button type='submit' disabled={isLoading}>
          {isLoading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  )
}