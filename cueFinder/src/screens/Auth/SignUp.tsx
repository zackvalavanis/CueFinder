import { useState } from "react"
import { Eye, EyeOff } from 'lucide-react'
import './SignUp.css'
import type { SignupPage } from "../../types/types"

export function SignUp() {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [formData, setFormData] = useState<SignupPage>({
    "first_name": "",
    "last_name": "",
    "email": "",
    "password": ""
  })

  return (
    <div>
      <form>
        <input type='text' name='first_name' placeholder="First Name"></input>
        <input type='text' name='last_name' placeholder="Last Name"></input>
        <input type='email' name='email' placeholder="Email"></input>
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
      </form>


    </div>
  )
}