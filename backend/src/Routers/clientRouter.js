const { Router } = require("express");
const router = new Router();
const pool = require("../Config/ormconfig");
const ClientController = require("../Controllers/ClientController");
//post one client
router.post("", ClientController.create);
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
