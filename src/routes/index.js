let express = require('express');
let router = express.Router();
const {nearBy,createOrders, ChangeOrders, getMessage, getOrderCancelByProvider, addProvider2} = require('../controllers/homerProvider');


router.post('/search', nearBy);
router.post('/orders/create',createOrders);
router.post('/orders/changestate',ChangeOrders);
router.post('/orders/endorders',getOrderCancelByProvider);
router.post('/message/getmessages',getMessage);
router.post('/provider/register', addProvider2);

module.exports = router;