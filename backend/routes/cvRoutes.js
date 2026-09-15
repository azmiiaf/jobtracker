const express = require('express')
const router = express.Router()
const {protect} = require('../middlewares/authMiddleware')
const {createCv, getAllCvs, getCvById, updateCv, deleteCv} = require('../controllers/cvController')

router.use(protect)

router.post('/', createCv)
router.get('/', getAllCvs)
router.get('/:id', getCvById)
router.put('/:id', updateCv)
router.delete('/:id', deleteCv)

module.exports = router