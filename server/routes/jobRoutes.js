const express = require('express');
const router = express.Router();
const authMiddleWare = require('../middleWare/authMiddleware');
const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
} = require('../controllers/jobcontroller');
router.post('/', authMiddleWare, createJob);
router.get('/', authMiddleWare, getAllJobs);
router.get('/:id', authMiddleWare, getJobById);
router.put('/:id', authMiddleWare, updateJob);
router.delete('/:id', authMiddleWare, deleteJob);
module.exports = router;
