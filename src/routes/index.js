let express = require('express');
let router = express.Router();
const {nearBy,createService} = require('../controllers/homerProvider');


router.post('/search', nearBy);
router.post('/orders/create',createService);

module.exports = router;