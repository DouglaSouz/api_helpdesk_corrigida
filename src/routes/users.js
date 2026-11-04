const express = require('express');
const pool = require('../db');
const router = express.Router();

// Login demonstrativo: retorna apenas identidade básica.
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Informe email e password como texto.' });
    }
    const result = await pool.query('SELECT id, name, email, role FROM users WHERE email = $1 AND password = $2', [email, password]);
    if (!result.rows[0]) return res.status(401).json({ error: 'Credenciais inválidas' });
    res.json({ message: 'Login realizado', user: result.rows[0] });
  } catch (error) { next(error); }
});
module.exports = router;
