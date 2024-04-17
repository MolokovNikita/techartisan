const { Router } = require('express');
const router = new Router();
const pool = require('../Config/ormconfig');
const StatusOfOrderToCardController = require('../Controllers/StatusOfOrderToCardController');
// Создание записи
router.post('/create', StatusOfOrderToCardController.create);
// Получение всех записей
router.get('/getAll', StatusOfOrderToCardController.getAll);
// Получение одной записи по идентификатору
router.get('/getOne/:id', StatusOfOrderToCardController.getOne);
// Обновление записи
router.put('/update', StatusOfOrderToCardController.update);
// Удаление одной записи по идентификатору
router.delete('/deleteOne/:id', StatusOfOrderToCardController.deleteOne);
// Удаление связи между устройством и картой заказа
router.delete('/deleteRelation', StatusOfOrderToCardController.deleteOneStatus);
// Удаление всех записей
router.delete('/deleteAll', StatusOfOrderToCardController.deleteAll);
module.exports = router;
