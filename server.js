const express = require('express')
const app = express()
const path = require('path')
const { open } = require('sqlite')
const sqlite3 = require('sqlite3')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const dbPath = path.join(__dirname, 'mapDashboard.db')

app.use(express.json())

let db = null

//  Initialize Database and Server
const initializeDBandServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
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
function authenticateToken(request, response, next) {
  const jwtToken = request.headers?.authorization?.split(' ')[1]

  if (!jwtToken) {
    return response.status(401).json({ error: 'Unauthorized. Missing JWT Token' })
  }

  jwt.verify(jwtToken, 'MY_SECRET_KEY', (error, payload) => {
    if (error) {
      return response.status(403).json({ error: 'Forbidden. Invalid JWT Token' })
    } else {
      request.user = payload
      next()
    }
  })
}

//  Login Endpoint
app.post('/login', async (request, response) => {
  const { username, password } = request.body

  try {
    const selectUserQuery = `SELECT * FROM users WHERE username = ?`
    const databaseUser = await db.get(selectUserQuery, [username])

    if (!databaseUser) {
      return response.status(400).json({ error: 'Invalid username or password' })
    }

    const isPasswordMatched = await bcrypt.compare(password, databaseUser.password)

    if (isPasswordMatched) {
      const payload = { id: databaseUser.id, username: databaseUser.username }
      const jwtToken = jwt.sign(payload, 'MY_SECRET_KEY', { expiresIn: '1h' })
      response.json({ jwtToken })
    } else {
      response.status(400).json({ error: 'Invalid username or password' })
    }
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'Internal Server Error' })
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

//  Error Handler Middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

// Initialize DB and Server
initializeDBandServer()

module.exports = app
