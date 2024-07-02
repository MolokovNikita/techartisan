const { Router } = require("express");
const router = new Router();
const pool = require("../Config/ormconfig");
const StaffToCardController = require("../Controllers/StaffToCardController");
// Создание записи
router.post("/create", StaffToCardController.create);
// Получение всех записей
router.get("/getAll", StaffToCardController.getAll);
// Получение одной записи по идентификатору
router.get("/getOne/:id", StaffToCardController.getOne);
// Обновление записи
router.put("/update", StaffToCardController.update);
// Удаление одной записи по идентификатору
router.delete("/deleteOne/:id", StaffToCardController.deleteOne);
// Удаление связи между устройством и картой заказа
router.delete("/deleteRelation", StaffToCardController.deleteOneStaff);
// Удаление всех записей
router.delete("/deleteAll", StaffToCardController.deleteAll);
module.exports = router;
