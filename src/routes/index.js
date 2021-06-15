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
} = require("../controllers/homerProvider");

router.post("/search", nearBy);
router.post("/test", (req, res) => {
  res.status(200).json({ code: "success", msg: "procesado correctamente" });
});
router.get("/test", (req, res) => {
  res.status(200).json({ code: "success", msg: "procesado correctamente" });
});
router.post("/orders/create", createOrders);
router.post("/orders/changestate", ChangeOrders);
router.post("/orders/endorders", getOrderCancelByProvider);
router.post("/message/getmessages", getMessage);
router.post("/provider/register", addProvider2);
router.post("/provider/getonesignal", providerOneSignal);

module.exports = router;
