const express = require('express');
const router = express.Router();

const authMiddleWare = require('../middleWare/authMiddleware');
const upload = require('../middleWare/upload');
const { uploadResume } = require('../controllers/profileController');
const {
  updateProfile,
  getProfile,
} = require('../controllers/profileController');

router.put(
  '/upload-resume',
  authMiddleWare,
  upload.single('resume'),
  uploadResume
);
router.put('/update', authMiddleWare, updateProfile);
router.get('/', authMiddleWare, getProfile);

module.exports = router;
