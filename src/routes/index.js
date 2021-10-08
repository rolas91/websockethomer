let express = require("express");
let router = express.Router();
const {
  nearBy,
  createOrders,
  ChangeOrders,
  getMessage,
  getOrderCancelByProvider,
  addProvider2,
  providerOneSignal,
  verifyStatus,
  verifyStatusForPay,
  createProvider,
} = require("../controllers/homerProvider");

router.post("/test", (req, res) => {
  res.status(200).json({ code: "success", msg: "procesado correctamente" });
});

router.post("/orders/create", createOrders);
router.post("/orders/changestate", ChangeOrders);
router.post("/orders/endorders", getOrderCancelByProvider);
router.post("/message/getmessages", getMessage);
router.post("/provider/register", addProvider2);
router.post("/provider/create-new", createProvider);
router.post("/provider/getonesignal", providerOneSignal);
router.post("/provider/verify-order-status", verifyStatus);
router.post("/provider/verify-order-forpay", verifyStatusForPay);

module.exports = router;
