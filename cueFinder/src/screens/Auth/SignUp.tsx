import { useState } from "react"
import { Eye, EyeOff } from 'lucide-react'
import './SignUp.css'
import type { SignupPage } from "../../types/types"

export function SignUp() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
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
      const res = await fetch('http://localhost:8000/users', {
        "method": "POST",
        "headers": {
          "Content Type": "application/json"
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          password: formData.password
        })
      })
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
          <input type='text' name='first_name' placeholder="First Name"></input>
          <input type='text' name='last_name' placeholder="Last Name"></input>
          <input type='email' name='email' placeholder="Email"></input>



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
        <button type='submit'>Sign Up</button>
      </form>
    </div>
  )
}