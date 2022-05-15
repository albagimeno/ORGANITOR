const { Router } = require('express')
const router = Router();

const { mostrarIndex } = require('../controllers/index.controller');

router.get('/', mostrarIndex);

module.exports = router;