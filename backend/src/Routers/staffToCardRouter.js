const { Router } = require("express");
const router = new Router();
const pool = require("../config/ormconfig");
const StaffToCardController = require("../controllers/staffToCardController");
// Создание записи
router.post("/", StaffToCardController.create);
// Получение всех записей
router.get("/", StaffToCardController.getAll);
// Получение одной записи по идентификатору
router.get("/:id", StaffToCardController.getOne);
// Обновление записи
router.put("/", StaffToCardController.update);
// Удаление всех записей
router.delete("/", StaffToCardController.deleteAll);
// Удаление одной записи по идентификатору
router.delete("/:id", StaffToCardController.deleteOne);
// Удаление связи между устройством и картой заказа
router.delete("/deleteRelation", StaffToCardController.deleteOneStaff);
module.exports = router;
