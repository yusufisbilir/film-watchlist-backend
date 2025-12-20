import express from 'express'
import {
  addToWatchlist,
  removeFromWatchlist,
  updateWatchlistItem,
  getWatchlistItems,
  getWatchlistItem,
} from '../controllers/watchlist.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { addToWatchlistSchema } from '../validators/watchlist.validator.js'
import { validateRequest } from '../middleware/validateRequest.middleware.js'


const router = express.Router()

router.use(authMiddleware)

router.post('/', validateRequest(addToWatchlistSchema), addToWatchlist)
router.delete('/:id', removeFromWatchlist)
router.put('/:id', updateWatchlistItem)
router.get('/', getWatchlistItems)
router.get('/:id', getWatchlistItem)

export default router
