let express = require('express');
let router = express.Router();
const {nearBy,createOrders, ordersEnd} = require('../controllers/homerProvider');


router.post('/search', nearBy);
router.post('/orders/create',createOrders);
router.post('/orders/endorders',ordersEnd);

module.exports = router;