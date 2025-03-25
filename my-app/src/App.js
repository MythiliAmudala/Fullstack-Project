import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import MapView from './components/MapView'
import './App.css'

const ProtectedRoute = ({ children }) => {
  const token = Cookies.get('jwt_token')

  if (!token) {
    return <Navigate to="/" replace />
  }

  return children
}

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/map"
          element={
            <ProtectedRoute>
              <MapView />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
