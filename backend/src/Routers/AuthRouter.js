const { Router } = require('express');
const AuthController = require('../Controllers/Auth.js')
const AuthValidator = require('../validators/Auth.js')
const pool = require('../Config/ormconfig');
const CardOfOrderController = require('../Controllers/CardOfOrderController');
const router = Router();

router.post("/sign-in", AuthValidator.signIn, AuthController.signIn);
router.post("/sign-up", AuthValidator.signUp, AuthController.signUp);
router.post("/logout", AuthValidator.logOut, AuthController.logOut);
router.post("/refresh", AuthValidator.refresh, AuthController.refresh);

module.exports = router;