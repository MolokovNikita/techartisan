const { Router } = require("express");
const router = new Router();
const pool = require("../Config/ormconfig");
const OfficesToCardController = require("../Controllers/OfficesToCardController");
// Создание записи
router.post("/create", OfficesToCardController.create);
// Получение всех записей
router.get("/getAll", OfficesToCardController.getAll);
// Получение одной записи по идентификатору
router.get("/getOne/:id", OfficesToCardController.getOne);
// Обновление записи
router.put("/update", OfficesToCardController.update);
// Удаление одной записи по идентификатору
router.delete("/deleteOne/:id", OfficesToCardController.deleteOne);
// Удаление связи между устройством и картой заказа
router.delete("/deleteRelation", OfficesToCardController.deleteOneOffice);
// Удаление всех записей
router.delete("/deleteAll", OfficesToCardController.deleteAll);
module.exports = router;
