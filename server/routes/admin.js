const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authUser, authUserRole } = require('../controllers/basicAuth');


router.get('/admin',authUser(),authUserRole(['admin']),adminController.adminDash);
router.get('/admin/userlist',authUser(),authUserRole(['admin']),adminController.userList);
router.get('/admin/adduser',authUser(),authUserRole(['admin']),adminController.adduserform);
router.post('/admin/adduser',authUser(),authUserRole(['admin']),adminController.adduser);
// router.get('/admin',adminController.adminDash);

module.exports = router;