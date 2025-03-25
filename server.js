const express = require('express')
const path = require('path')
const { open } = require('sqlite')
const sqlite3 = require('sqlite3')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const app = express()
app.use(express.json())

const dbPath = path.join(__dirname, 'mapDashboard.db')
let db = null

//  Initialize Database and Server
const initializeDBandServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })

    app.listen(3000, () => {
      console.log('Server Running On http://localhost:3000')
    })
  } catch (error) {
    console.error(`DB Error: ${error.message}`)
    process.exit(1)
  }
}

//  JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const jwtToken = req.headers?.authorization?.split(' ')[1]

  if (!jwtToken) {
    return res.status(401).json({ error: 'Unauthorized. Missing JWT Token' })
  }

  jwt.verify(jwtToken, 'MY_SECRET_KEY', (error, payload) => {
    if (error) {
      return res.status(403).json({ error: 'Forbidden. Invalid JWT Token' })
    }
    req.user = payload
    next()
  })
}

//  Login Endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body

  try {
    const query = `SELECT * FROM users WHERE username = ?`
    const user = await db.get(query, [username])

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: 'Invalid username or password' })
    }

    const payload = { id: user.id, username: user.username }
    const jwtToken = jwt.sign(payload, 'MY_SECRET_KEY', { expiresIn: '1h' })
    res.json({ jwtToken })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

//  Dashboard API → Fetch Dashboard Cards
app.get('/api/dashboard', authenticateToken, async (req, res) => {
  try {
    const query = `SELECT * FROM cards`
    const cards = await db.all(query)

    if (cards.length === 0) {
      return res.status(404).json({ error: 'No dashboard data found' })
    }

    res.json(cards)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch dashboard data' })
  }
})

//  Map API → Fetch Dynamic Map Locations
app.get('/api/map', authenticateToken, async (req, res) => {
  try {
    const query = `SELECT * FROM locations`
    const locations = await db.all(query)

    if (locations.length === 0) {
      return res.status(404).json({ error: 'No map data found' })
    }

    res.json(locations)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch map data' })
  }
})

//  Protected Route → For Testing JWT
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ 
    message: 'You have access to the protected route!', 
    user: req.user 
  })
})

//  Home Route
app.get('/', (req, res) => {
  res.send('Welcome to the Map Dashboard API')
})

// Error Handler Middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

initializeDBandServer()

module.exports = app
