const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const serverless=require('serverless-http');
const router = require('./router/routes');
const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files (like CSS, JS, images) from the "public" folder
app.use(express.static('public'));

// Use body-parser for parsing JSON and URL-encoded data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set up your MongoDB connection and other configurations as before...
mongoose.connect('mongodb://127.0.0.1:27017/bankmanagement', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to the database');
}).catch((err) => {
  console.error('Error connecting to the database:', err);
});

// Serve the intro.html page as the default landing page at the root URL ("/")
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/intro.html');
});

// Serve your main index.html at the /index.html URL
// app.get('/index.html', (req, res) => {
//   res.sendFile(__dirname + '/public/index.html');
// });

// Use the routes defined in routes.js (if you have additional routes)
app.use(require('./router/routes'));

// Set the view engine and other configurations as before...
app.set("view engine", "ejs");

// Listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/intro.html`);
});
