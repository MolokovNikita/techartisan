const { Router } = require("express");
const router = new Router();
const pool = require("../config/ormconfig");
const DevicesToCardController = require("../controllers/devicesToCardController");
//post one
router.post("/create", DevicesToCardController.create);
// Получение всех записей
router.get("/getAll", DevicesToCardController.getAll);
// Получение одной записи по идентификатору
router.get("/getOne/:id", DevicesToCardController.getOne);
// Обновление записи
router.put("/update", DevicesToCardController.update);
// Удаление одной записи по идентификатору
router.delete("/deleteOne/:id", DevicesToCardController.deleteOne);
// Удаление связи между устройством и картой заказа
router.delete("/deleteRelation", DevicesToCardController.deleteOneDevice);
// Удаление всех записей
router.delete("/deleteAll", DevicesToCardController.deleteAll);
module.exports = router;
