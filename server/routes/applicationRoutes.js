const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleWare/authMiddleware');
const {
  applyJob,
  getMyApplications,
  getApplicantsByJob,
  updateApplicationStatus,
} = require('../controllers/applicationController');

router.post('/apply/:jobId', authMiddleware, applyJob);
router.get('/my', authMiddleware, getMyApplications);
router.get('/job/:jobId', authMiddleware, getApplicantsByJob);
router.put('/:id/status', authMiddleware, updateApplicationStatus);
module.exports = router;
