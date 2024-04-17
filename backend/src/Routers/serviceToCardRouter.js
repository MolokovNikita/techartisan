const { Router } = require('express');
const router = new Router();
const pool = require('../Config/ormconfig');
const ServicesToCardController = require('../Controllers/ServicesToCardController');
// Создание записи
router.post('/create', ServicesToCardController.create);
// Получение всех записей
router.get('/getAll', ServicesToCardController.getAll);
// Получение одной записи по идентификатору
router.get('/getOne/:id', ServicesToCardController.getOne);
// Обновление записи
router.put('/update', ServicesToCardController.update);
// Удаление одной записи по идентификатору
router.delete('/deleteOne/:id', ServicesToCardController.deleteOne);
// Удаление связи между устройством и картой заказа
router.delete('/deleteRelation', ServicesToCardController.deleteOneOffice);
// Удаление всех записей
router.delete('/deleteAll', ServicesToCardController.deleteAll);
module.exports = router;
