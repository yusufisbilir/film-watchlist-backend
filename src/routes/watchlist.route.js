import express from 'express'
import { addToWatchlist, removeFromWatchlist } from '../controllers/watchlist.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

const router = express.Router()

router.use(authMiddleware)

router.post('/', addToWatchlist)
router.delete('/:id', removeFromWatchlist)

export default router
