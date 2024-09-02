const { Router } = require("express");
const router = new Router();
const pool = require("../config/ormconfig");
const StaffController = require("../controllers/staffController");
//post one staff
router.post("", StaffController.create);
//get all staff
router.get("", StaffController.getAll);
//get one staff by id
router.get("/:id", StaffController.getOne);
//update staff
router.put("", StaffController.update);
//delete one staff
router.delete("/:id", StaffController.deleteOne);
//delete all staff
router.delete("", StaffController.deleteAll);

module.exports = router;
