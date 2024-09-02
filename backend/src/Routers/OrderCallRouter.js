const { Router } = require("express");
const router = new Router();
const pool = require("../config/ormconfig");
const OrderCallController = require("../controllers/orderCallController");

router.post("", OrderCallController.create);
router.get("", OrderCallController.getAll);
router.get("/:id", OrderCallController.getOne);
router.put("", OrderCallController.update);
router.delete("/:id", OrderCallController.deleteOne);
// router.delete("", ClientController.deleteAll);

module.exports = router;
