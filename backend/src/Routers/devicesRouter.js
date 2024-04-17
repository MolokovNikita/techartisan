const { Router } = require('express');
const router = new Router();
const pool = require('../Config/ormconfig');
const DevicesController = require('../Controllers/DevicesController');
//post one Card
router.post('', DevicesController.create);
//get all Cards
router.get('', DevicesController.getAll);
//get one Card by id
router.get('/:id', DevicesController.getOne);
//update Card
router.put('', DevicesController.update)
//delete one Card
router.delete('/:id', DevicesController.deleteOne)
//delete all Cards
router.delete('', DevicesController.deleteAll);

module.exports = router;
