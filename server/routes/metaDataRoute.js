const express = require('express');
const { createMetaData, createDataFromImage, removeBackgroundImage } = require('../controllers/metadataController');
const { uploadFile } = require('../middleware/uploadFile');

//router object
const router = express.Router();

//routers
router.post('/create', uploadFile.single('file'), createMetaData);
router.post('/text', uploadFile.single('file'), createDataFromImage);
router.post('/removebg', uploadFile.single('file'), removeBackgroundImage);

// exports
module.exports = router;