const { Router } = require("express");
const router = new Router();
const pool = require("../config/ormconfig");
const PositionController = require("../controllers/positionsController");
//post one position
router.post("", PositionController.create);
//get all positions
router.get("", PositionController.getAll);
//get one position by id
router.get("/:id", PositionController.getOne);
//update position
router.put("", PositionController.update);
//delete one position
router.delete("/:id", PositionController.deleteOne);
//delete all positions
router.delete("", PositionController.deleteAll);

module.exports = router;
