const express = require('express');
const { getPosts, createPost } = require('../controllers/postController');
const router = express.Router();

router.get('/', (req, res) => {
    getPosts(req, res);
});

router.post('/', (req, res) => {
    createPost(req, res);
});

module.exports = router;