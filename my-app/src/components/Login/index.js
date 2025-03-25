import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (event) => {
    event.preventDefault()

    const userDetails = { username, password }
    const apiUrl = 'https://apis.ccbp.in/login'   // Correct API endpoint

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userDetails)
      })

      const data = await response.json()

      if (response.ok) {
        Cookies.set('jwt_token', data.jwt_token, { expires: 1 })
        navigate('/dashboard')
      } else {
        setError(data.error_msg || 'Invalid credentials')
      }
    } catch (error) {
      setError('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="form-container">
        <h1>Login</h1>
        
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <button type="submit">Login</button>
        
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  )
}

export default Login
