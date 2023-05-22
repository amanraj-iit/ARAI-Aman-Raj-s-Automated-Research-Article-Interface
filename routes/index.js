const express = require('express');
const { renderIndex, renderConfirmEmail, renderUnsubscribe, HandlePost} = require('../controllers');

const router = express.Router();

router.get('/', renderIndex);
router.get('/confirmEmail', renderConfirmEmail);
router.get('/unsubscribe', renderUnsubscribe);
router.post('/', HandlePost);

module.exports = router