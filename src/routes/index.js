let express = require('express');
let router = express.Router();
const {nearBy,createOrders, ChangeOrders} = require('../controllers/homerProvider');


router.post('/search', nearBy);
router.post('/orders/create',createOrders);
router.post('/orders/changestate',ChangeOrders);

module.exports = router;