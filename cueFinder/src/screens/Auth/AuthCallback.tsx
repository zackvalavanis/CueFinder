import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../Components/useAuth";


export function AuthCallback() {
  const navigate = useNavigate();
  const { login } = useAuth()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')

    if (token) {
      login(token)
      navigate('/')
    } else {
      navigate('/login')
    }
  }, [])

  return (
    <p>Signing you in...</p>
  )
}
