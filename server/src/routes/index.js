import express from 'express'
import { controllers } from '../controllers/userControllers.js'

const router = express.Router()
router.post('/api/save',controllers.saveData)
router.get('/api/getsaved',controllers.getsavedData)
router.get('/api/getsinglevoucherdata/:vr_no',controllers.getSingleVoucherData)

export default router