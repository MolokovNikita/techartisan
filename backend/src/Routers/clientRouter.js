const { Router } = require("express");
const router = new Router();
const pool = require("../config/ormconfig");
const ClientController = require("../controllers/clientController");
const {body} = require('express-validator');

//post one client
router.post("", ClientController.registration);
// router.post("/registration",
//     body('email').isEmail(),
//     body('pass').isLength({min:3,max:32}),
//     ClientController.registration
// );

//get all clients
router.get("", ClientController.getAll);
//get one client by id
router.get("/:id", ClientController.getOne);
//update client
router.put("", ClientController.update);
//updatepassword
router.put("/password", ClientController.updatePassword);
router.put("/password/recover", ClientController.recoverPassword);
//delete one client
router.delete("/:id", ClientController.deleteOne);
//delete all clients
// router.delete("", ClientController.deleteAll);

module.exports = router;
