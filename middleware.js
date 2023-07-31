
const dbClient = require('./server/client');

const checkClient = async (req, res, next) => {
  const { ID } = req.params;
  try {
    const result = await dbClient.query('SELECT * FROM users WHERE id = $1', [ID]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    req.user = result.rows[0]; 
    next();
  } catch (err) {
    console.error('Error checking client:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { checkClient };
