const express = require('express');
const app = express();

// Use an environment variable for the port, fallback to 3000 if not defined
const PORT = process.env.PORT || 3000;

// Standard middleware so our backend can accept JSON data sent from the Vite frontend
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ 
    status: "active", 
    message: "Manikyapriya Agencies backend running smoothly." 
  });
});

app.listen(PORT, () => {
  // Check your terminal window right after running the server to see this print!
  console.log(`[SERVER] Distribution engine live on port ${PORT}`);
});