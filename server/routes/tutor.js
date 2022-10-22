const express = require('express');
const router = express.Router();
const tutorController = require('../controllers/tutorController');
const adminController = require('../controllers/adminController');
const { authUser, authUserRole } = require('../controllers/basicAuth');

router.get('/tutor',authUser(),authUserRole(['tutor']),tutorController.tutorDash);
router.get('/tutor/userlist',authUser(),authUserRole(['tutor']),adminController.userList);

module.exports = router;