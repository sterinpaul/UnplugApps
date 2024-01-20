import express from 'express'
import { controllers } from '../controllers/userControllers.js'

const router = express.Router()
// Post to save invoice
router.post('/api/save',controllers.saveData)
// Get saved invoices header
router.get('/api/getsaved',controllers.getsavedData)
// Get invoice details table of particular voucher number
router.get('/api/getsinglevoucherdata/:vr_no',controllers.getSingleVoucherData)

export default router