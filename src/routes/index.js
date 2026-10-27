const express = require('express');
const users = require('../controllers/users');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

router.get('/users', users.list);
router.get('/users/:id', users.get);
router.post('/users', users.create);
router.put('/users/:id', users.update);
router.delete('/users/:id', users.remove);

module.exports = router;
