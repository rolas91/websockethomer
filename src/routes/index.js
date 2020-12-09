let express = require('express');
let router = express.Router();
const {nearBy,createOrders} = require('../controllers/homerProvider');


router.post('/search', nearBy);
router.post('/orders/create',createOrders);

module.exports = router;