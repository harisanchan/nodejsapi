const express = require('express');
const users = require('../controllers/users');
const pkg = require('../../package.json');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

// Confirms which build is live: bump "version" in package.json (or set the
// BUILD_VERSION env var) on each deploy, then check this after restarting.
const startedAt = new Date().toISOString();
router.get('/version', (req, res) => {
  res.json({
    version: process.env.BUILD_VERSION || pkg.version,
    startedAt,
    node: process.version,
    environment: process.env.NODE_ENV || 'development',
  });
});

router.get('/users', users.list);
router.get('/users/:id', users.get);
router.post('/users', users.create);
router.put('/users/:id', users.update);
router.delete('/users/:id', users.remove);

module.exports = router;
