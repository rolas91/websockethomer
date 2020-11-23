let express = require('express');
let router = express.Router();
const {nearBy} = require('../controllers/homerProvider');


router.post('/search', nearBy);

module.exports = router;