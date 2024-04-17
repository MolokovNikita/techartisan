const { Router } = require('express');
const router = new Router();
const pool = require('../Config/ormconfig');
const PositionToStaffController = require('../Controllers/PositionsToStaffController');
// Создание записи
router.post('/create', PositionToStaffController.create);
// Получение всех записей
router.get('/getAll', PositionToStaffController.getAll);
// Получение одной записи по идентификатору
router.get('/getOne/:id', PositionToStaffController.getOne);
// Обновление записи
router.put('/update', PositionToStaffController.update);
// Удаление одной записи по идентификатору
router.delete('/deleteOne/:id', PositionToStaffController.deleteOne);
// Удаление связи между устройством и картой заказа
router.delete('/deleteRelation', PositionToStaffController.deleteOnePosition);
// Удаление всех записей
router.delete('/deleteAll', PositionToStaffController.deleteAll);
module.exports = router;
