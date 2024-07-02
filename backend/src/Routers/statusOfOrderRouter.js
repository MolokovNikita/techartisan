const { Router } = require("express");
const router = new Router();
const pool = require("../Config/ormconfig");
const StatusOfOrderController = require("../Controllers/StatusOfOrderController");
//post one statuses
router.post("", StatusOfOrderController.create);
//get all statuses
router.get("", StatusOfOrderController.getAll);
//get one status by id
router.get("/:id", StatusOfOrderController.getOne);
//update status
router.put("", StatusOfOrderController.update);
//delete one status
router.delete("/:id", StatusOfOrderController.deleteOne);
//delete all statuses
router.delete("/", StatusOfOrderController.deleteAll);

module.exports = router;
