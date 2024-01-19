import express from 'express'
import { controllers } from '../controllers/userControllers.js'

const router = express.Router()
router.get('/api/getitem',controllers.getItemList)
router.post('/api/save',controllers.saveData)

export default router