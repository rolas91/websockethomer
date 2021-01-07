let express = require('express');
let router = express.Router();
const {nearBy,createOrders, ordersEnd} = require('../controllers/homerProvider');


router.post('/search', nearBy);
router.post('/orders/create',createOrders);
router.post('/orders/changestate',ordersEnd);

module.exports = router;