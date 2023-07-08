// api.js
const express = require('express');
const router = express.Router();
const sampleController = require('../controllers/sampleController');

// Define API routes
router.get('/samples', sampleController.getSamples);
router.post('/samples', sampleController.createSample);

module.exports = router;