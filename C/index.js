const router = require('express').Router();
const home = require('./C-home');
const post = require('./C-postpage')
const api = require('./api')

router.use('/postpage', post);
router.use('/', home);
router.use('/api', api);

module.exports = router;