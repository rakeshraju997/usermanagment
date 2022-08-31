const express = require('express');
const router = express.Router();
const tutorController = require('../controllers/tutorController');
const { authUser, authUserRole } = require('../controllers/basicAuth');

router.get('/tutor',authUser(),authUserRole(['tutor']),tutorController.tutorDash);

module.exports = router;