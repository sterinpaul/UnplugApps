import express from 'express'
import { controllers } from '../controllers/userControllers.js'

const router = express.Router()
router.post('/api/save',controllers.saveData)
router.get('/api/getsaved',controllers.getsavedData)

export default router