const express = require('express');
const { getAllCanvases, createCanvas, loadCanvas, updateCanvas, shareCanvas, deleteCanvas } = require('../controllers/canvasController');
const authenticationMiddleware = require('../middlewares/authenticationMiddleware');

const router = express.Router();

router.get('/', authenticationMiddleware, getAllCanvases);
router.post('/', authenticationMiddleware, createCanvas);
router.get('/load/:id', authenticationMiddleware, loadCanvas);
router.put('/:id', authenticationMiddleware, updateCanvas);
router.put('/share/:id', authenticationMiddleware, shareCanvas);
router.delete('/:id', authenticationMiddleware, deleteCanvas);

module.exports = router;