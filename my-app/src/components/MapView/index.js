import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import axios from 'axios'
import Cookies from 'js-cookie'
import { Container, CircularProgress, Typography, Button } from '@mui/material'
import './index.css'

const MapView = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [mapConfig, setMapConfig] = useState(null)
  const navigate = useNavigate()

  const fetchMapData = useCallback(async () => {
    const token = Cookies.get('jwt_token')

    if (!token) {
      navigate('/')
      return
    }

    try {
      const response = await axios.get('https://apis.ccbp.in/map', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.status === 200 && response.data) {
        const { latitude, longitude, zoom } = response.data
        setMapConfig({ latitude, longitude, zoom: zoom || 5 })
      } else {
        setError('Failed to load map data')
      }
    } catch (error) {
      setError('Error fetching map data')
    } finally {
      setLoading(false)
    }
  }, [navigate])

  useEffect(() => {
    fetchMapData()
  }, [fetchMapData])

  const handleLogout = () => {
    Cookies.remove('jwt_token')
    navigate('/')
  }

  if (loading) {
    return (
      <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <Typography variant="h5" color="error">{error}</Typography>
        <Button onClick={() => navigate('/dashboard')}>Go Back</Button>
      </Container>
    )
  }

  return (
    <Container>
      <Typography variant="h4">India Map View</Typography>
      <Button onClick={handleLogout}>Logout</Button>

      {mapConfig && (
        <MapContainer center={[mapConfig.latitude, mapConfig.longitude]} zoom={mapConfig.zoom} style={{ height: '500px', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[mapConfig.latitude, mapConfig.longitude]}>
            <Popup>India Map - Zoom and Explore!</Popup>
          </Marker>
        </MapContainer>
      )}
    </Container>
  )
}

export default MapView
