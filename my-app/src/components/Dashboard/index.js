import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'js-cookie'
import './index.css'

const Dashboard = () => {
  const [cards, setCards] = useState([])
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = Cookies.get('jwt_token')
      if (!token) {
        navigate('/')
        return
      }

      try {
        const response = await axios.get('http://localhost:3000/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setCards(response.data)
      } catch (error) {
        setError('Failed to load dashboard data')
      }
    }

    fetchDashboardData()
  }, [navigate])

  const handleLogout = () => {
    Cookies.remove('jwt_token')
    navigate('/')
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>
      <div className="cards-container">
        {cards.map((card) => (
          <div
            key={card.id}
            className="card"
            onClick={() => navigate(`/map/${card.id}`)}
          >
            <h3>{card.title}</h3>
            <p>{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard
