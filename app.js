
const express = require('express');
const dbClient = require('./server/client');
const { body, validationResult } = require('express-validator');
const { checkClient } = require('./middleware');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());


app.get('/CLIENTS', async (req, res) => {
  try {
    const result = await dbClient.query('SELECT * FROM CLIENTS');
    res.json(result.rows);
  } catch (err) {
    console.error('Error retrieving CLIENTS:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/CLIENTS/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await dbClient.query('SELECT * FROM CLIENTS WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error retrieving client:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/CLIENTS', [
  body('firstname').notEmpty().withMessage('Firstname is required').trim(),
  body('lastname').notEmpty().withMessage('Lastname is required').trim(),
  body('password').notEmpty().withMessage('Password is required').trim(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstname, lastname, password } = req.body;

  try {
    const result = await dbClient.query(
      'INSERT INTO CLIENTS (firstname, lastname) VALUES ($1, $2, $3) RETURNING *',
      [firstname, lastname, password]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating client:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




app.delete('/CLIENTS/:ID', checkClient, async (req, res) => {
    const { ID } = req.params;
    try {
      const result = await dbClient.query('DELETE FROM users WHERE id = $1 RETURNING *', [ID]);
      res.json(result.rows[0]);
    } catch (err) {
      console.error('Error deleting client:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
 
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
