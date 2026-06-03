import app from './app.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  // Check your terminal window right after running the server to see this print!
  console.log(`Distribution engine live on port ${PORT}`);
});