const { Router } = require("express");
const router = new Router();
const CardOfOrderController = require("../Controllers/CardOfOrderController");
//post one Card
router.post("", CardOfOrderController.create);
//get all Cards
router.get("", CardOfOrderController.getAll);
//get one Card by id
router.get("/:id", CardOfOrderController.getOne);
//get one Card by client id
router.get("/client/:id", CardOfOrderController.getOneByClientId);

//update Card
router.put("", CardOfOrderController.update);
//delete one Card
router.delete("/:id", CardOfOrderController.deleteOne);
//delete all Cards
router.delete("", CardOfOrderController.deleteAll);

module.exports = router;
