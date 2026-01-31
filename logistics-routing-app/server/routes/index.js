// API endpoint definitions

const express = require('express');
const router = express.Router();

const routeController = require('../controllers/routeController');
const authController = require('../controllers/authController');

// Auth routes
router.post('/auth/signup', authController.signup);
router.post('/auth/login', authController.login);

// Route calculation routes
router.post('/routes', routeController.getRoute);
router.get('/distribution-centres', routeController.getDistributionCentres);

module.exports = router;

