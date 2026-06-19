import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Sample API routes
app.get('/api/status', (req, res) => {
  res.json({
    status: 'success',
    message: 'Bilal Cafe API Server is running smoothly!',
    timestamp: new Date()
  });
});

app.get('/api/menu', (req, res) => {
  res.json({
    message: 'Menu list placeholder. Integrate database queries here.'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
