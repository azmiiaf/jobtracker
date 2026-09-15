const express = require('express')
const router = express.Router()
const { getDashboardStats } = require('../controllers/dashboardController')
const { protect } = require('../middlewares/authMiddleware')

// Proteksi endpoint dashboard
router.use(protect)

// GET /api/dashboard/stats
router.get('/stats', getDashboardStats)

module.exports = router