const { Router } = require("express");
const router = new Router();
const pool = require("../Config/ormconfig");
const OfficesController = require("../Controllers/OfficesController");
//post one office
router.post("", OfficesController.create);
//get all offices
router.get("", OfficesController.getAll);
//get one office by id
router.get("/:id", OfficesController.getOne);
//update office
router.put("", OfficesController.update);
//delete one office
router.delete("/:id", OfficesController.deleteOne);
//delete all offices
router.delete("", OfficesController.deleteAll);

module.exports = router;
