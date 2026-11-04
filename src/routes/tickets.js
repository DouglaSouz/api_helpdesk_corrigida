const express = require('express');
const pool = require('../db');
const router = express.Router();

// Lista básica de chamados.
router.get('/', async (_req, res, next) => {
  try {
    const result = await pool.query('SELECT id, title, status, requester_id, created_at FROM tickets ORDER BY id');
    res.json(result.rows);
  } catch (error) { next(error); }
});

// Pesquisa simples de chamados (CORRIGIDO).
router.get('/search', async (req, res, next) => {
  try {
    const term = String(req.query.term || '');
    // Correção: Uso de consulta parametrizada ($1) em vez de interpolação de string.
    const sql = 'SELECT id, title, status FROM tickets WHERE title ILIKE $1 ORDER BY id';
    const result = await pool.query(sql, [`%${term}%`]);
    res.json(result.rows);
  } catch (error) { next(error); }
});

// Consulta detalhada de um chamado.
router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) return res.status(400).json({ error: 'ID inválido' });
    const result = await pool.query('SELECT * FROM tickets WHERE id = $1', [id]);
    if (!result.rows[0]) return res.status(404).json({ error: 'Chamado não encontrado' });
    res.json(result.rows[0]);
  } catch (error) { next(error); }
});

module.exports = router;