const { Router } = require("express");
const router = new Router();
const pool = require("../config/ormconfig");
const ServicesController = require("../controllers/servicesController");
//post one service
router.post("", ServicesController.create);
//get all services
router.get("", ServicesController.getAll);
//get one service by id
router.get("/:id", ServicesController.getOne);
//update service
router.put("", ServicesController.update);
//delete one service
router.delete("/:id", ServicesController.deleteOne);
//delete all services
router.delete("", ServicesController.deleteAll);

module.exports = router;
