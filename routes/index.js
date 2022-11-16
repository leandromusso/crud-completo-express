const express = require('express');
const router = express.Router();

//Requerimos el controlador
const mainController = require('../controllers/mainController');

router.get('/', mainController.index);

module.exports = router;
