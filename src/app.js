require('dotenv').config();
const express = require('express');
const pool = require('./db');
const tickets = require('./routes/tickets');
const users = require('./routes/users');
const app = express();
app.use(express.json());
app.get('/', (_req, res) => res.json({ project: 'Help Desk Lab', endpoints: ['/api/health', '/api/tickets', '/api/tickets/search?term=Wi-Fi', '/api/tickets/1', '/api/users/login'] }));
app.get('/api/health', async (_req, res, next) => {
  try { await pool.query('SELECT 1'); res.json({ status: 'ok', database: 'connected' }); }
  catch (error) { next(error); }
});
app.use('/api/tickets', tickets);
app.use('/api/users', users);
app.use((_req,res) => res.status(404).json({ error: 'Rota não encontrada' }));
app.use((error,_req,res,_next) => {
  console.error('Erro no servidor:', error.message);
  res.status(500).json({ error: 'Erro interno. Verifique o console local.' });
});
const port = Number(process.env.PORT || 3001);
app.listen(port, '127.0.0.1', () => console.log(`Help Desk Lab: http://127.0.0.1:${port}`));
