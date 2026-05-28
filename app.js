require('dotenv').config();

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const taskRoutes = require('./routes/tasks.routes');
const projectRoutes = require('./routes/projects.routes');
const authRouter = require('./routes/auth.routes');

// Security Gate Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Grabs the token from "Bearer <TOKEN>"

  if (!token) {
    return res.status(401).json({ error: "Access passport token missing." });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid or expired session token." });
    req.user = user; // Pass the verified user payload to the next function
    next(); // Let the request proceed to the controller
  });
};

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use('/auth', authRouter)
// Need Authorization header
app.use('/tasks', authenticateToken, taskRoutes);
app.use('/projects', authenticateToken, projectRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});