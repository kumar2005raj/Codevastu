const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('public')); // Serve static files from the 'public' directory

// MySQL Database connection
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '12345',
  database: 'credit_card_db'
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    process.exit(1); // Exit the process if unable to connect to the DB
  }
  console.log('Connected to the database');
});

// Luhn's Algorithm for validation
function luhnCheck(cardNumber) {
  let sum = 0;
  let shouldDouble = false;

  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber.charAt(i), 10);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

// GET / route to display a welcome message
// app.get('/', (req, res) => {
//   res.send(
//     '<h1>Welcome to the Credit Card Validator API</h1><p>Use the POST / route to validate a credit card number.</p>'
//   );
// });

// API route to validate credit card number
app.post('/validate-card', (req, res) => {
  const { cardNumber } = req.body; // Correct destructuring

  // Validate input
  if (!cardNumber || typeof cardNumber !== 'string' || cardNumber.trim() === '') {
    return res
      .status(400)
      .json({ message: 'Invalid input. cardNumber must be a non-empty string.' });
  }

  if (luhnCheck(cardNumber)) {
    // Store valid card number in the database
    db.query(
      'INSERT INTO valid_cards (card_number) VALUES (?)',
      [cardNumber],
      (err, result) => {
        if (err) {
          console.error('Error inserting card number: ', err);
          return res.status(500).json({ message: 'Internal Server Error' });
        }
        console.log('Card number stored:', cardNumber);
        res.json({ valid: true, message: 'Card number is valid and has been stored.' });
      }
    );
  } else {
    res.json({ valid: false, message: 'Invalid card number. It has not been stored.' });
  } 
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
