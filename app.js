require('dotenv').config();

const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/tasks.routes');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use('/tasks', taskRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});