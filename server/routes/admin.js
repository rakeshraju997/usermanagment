const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authUser, authUserRole } = require('../controllers/basicAuth');


router.get('/admin',authUser(),authUserRole(['admin']),adminController.adminDash);
router.get('/admin/userlist',authUser(),authUserRole(['admin']),adminController.userList);
router.get('/admin/adduser',authUser(),authUserRole(['admin']),adminController.adduserform);
router.post('/admin/adduser',authUser(),authUserRole(['admin']),adminController.adduser);
router.get('/admin/updateuser/:id',authUser(),authUserRole(['admin']),adminController.updateuserform);
router.post('/admin/updateuser/:id',authUser(),authUserRole(['admin']),adminController.updateuser);
// router.get('/admin/delete/:id',authUser(),authUserRole(['admin']),adminController.delete);
router.get('/admin/viewuser/:id',authUser(),authUserRole(['admin']),adminController.viewuser);
// router.get('/admin',adminController.adminDash);

module.exports = router;