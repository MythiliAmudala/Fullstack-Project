---

# Syncthreads Assignment

### 🔥 **Frontend:**
- React.js
- React Router
- Axios (for API requests)
- Leaflet (for map integration)
- Material UI (for styling)

### 🛠️ **Backend:**
- Node.js
- Express.js
- JWT (JSON Web Token) for authentication
- CORS and dotenv
- MongoDB (for storing user data)

---

## 💻 **Installation & Setup**

1. **Clone the Repository**
```bash
git clone <repo-url>
cd syncthreads-assignment
```

2. **Install Dependencies**

### Client:
```bash
cd client
npm install
```

### Server:
```bash
cd server
npm install
```

3. **Environment Variables**
Create a `.env` file in the `/server` folder with the following values:
```
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
PORT=5000
```

4. **Start the Application**

- **Backend:**
```bash
cd server
npm start
```

- **Frontend:**
```bash
cd client
npm start
```

---

## 🔥 **API Endpoints**

### 💡 **Authentication**
- `POST /api/login` → Authenticates the user and generates a JWT token.

### 📊 **Dashboard**
- `GET /api/dashboard` → Returns dashboard card data (protected).

### 🗺️ **Map View**
- `GET /api/map` → Returns map configuration data (protected).

---

## 🛠️ **Authentication Flow**

1. User logs in with credentials.
2. On successful login:
   - Backend generates a JWT token.
   - Token is sent to the client.
3. The token is stored in `localStorage`.
4. On subsequent requests:
   - The token is included in the header (`Authorization: Bearer <token>`).
   - Backend verifies the token before allowing access to protected routes.

---

## 🌍 **Map Integration**
- **Library:** Leaflet
- **Initial View:** Displays India with zoom level 4.
- **Zoom In/Out:** Controlled using Leaflet controls.
- **Navigation:** Clicking a card on the dashboard navigates to the Map View.

---

## 🎯 **Features**

### ✅ **Login Page**
- Username and password fields.
- JWT authentication on form submission.
- Error handling for invalid credentials.
- Redirects to Dashboard on successful login.

### 📈 **Dashboard**
- Displays multiple cards with IDs.
- Clickable cards to navigate to Map View.
- Fetches data from the backend using Axios.
- Protected route using JWT.

### 🗺️ **Map View**
- Displays an interactive map of India.
- Zoom in/out functionality.
- Protected route (access restricted to authenticated users).
- Card ID (if relevant) is passed as a prop.

---

## 🖥️ **Component Overview**

### 🔑 **Login Component**
- Accepts username and password.
- Sends API request to `/api/login`.
- On success:
    - Stores JWT token.
    - Redirects to Dashboard.
- On failure:
    - Displays error message.

### 📊 **Dashboard Component**
- Displays multiple cards.
- Makes API request to `/api/dashboard`.
- Uses `useEffect()` to fetch data on component mount.
- Navigates to Map View on card click.

### 🌍 **Map View Component**
- Renders the Leaflet map.
- Sets India’s coordinates as the center.
- Implements zoom in/out functionality.

---

## 🎯 **Protected Routes Implementation**
- Uses React Router for navigation.
- `ProtectedRoute` component:
    - Checks for the JWT token in `localStorage`.
    - Redirects unauthenticated users to the login page.
    - Allows authenticated users to access protected routes.

---

## 🔥 **Error Handling**
- Displays `401 Unauthorized` message for unauthenticated access.
- Shows `404 Not Found` for invalid routes.
- Displays server error message on API failures.

---

## 🌟 **Styling and UI**
- Material UI components.
- Fully responsive layout.
- Cards styled with hover effects.
- Map with custom controls.
- Consistent color scheme and typography.

---

## ✅ **Testing Instructions**
1. Start the backend server.
2. Start the frontend client.
3. Open `http://localhost:3000` in your browser.
4. Login with valid credentials.
5. Navigate through:
    - **Dashboard**
    - **Map View**
6. Verify:
    - Unauthorized access redirects to login.
    - Map renders with India view.
    - Zoom in/out works smoothly.

---

## 🛠️ **Potential Improvements**
- **Pagination:** Add pagination for the dashboard card list.
- **Error Boundaries:** Enhance error handling with React error boundaries.
- **Map Markers:** Display markers on the map for specific locations.
- **Dark Mode:** Implement dark mode toggle for better UI experience.

---

## 📚 **References**
- [Leaflet Documentation](https://leafletjs.com/)
- [Material UI](https://mui.com/)
- [React Router](https://reactrouter.com/)

---

