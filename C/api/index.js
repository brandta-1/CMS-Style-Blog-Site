const router = require('express').Router();
const user = require('./C-user');
const post = require('./C-post');
const comment = require('./C-comment');

router.use('/users', user);
router.use('/posts', post);
router.use('/comments', comment);

module.exports = router;