const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authUser, authUserRole } = require('../controllers/basicAuth');

router.get('/',userController.index);
router.post('/login',userController.loginValidate);
router.get('/logout',userController.logout);

router.get('/candidate',authUser(),authUserRole(['candidate']),userController.candidateDash);



module.exports = router;