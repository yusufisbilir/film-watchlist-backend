import express from 'express'
import { createMovie, getMovies, getMovie, updateMovie, deleteMovie } from '../controllers/movie.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { createMovieSchema, updateMovieSchema } from '../validators/movie.validator.js'
import { validateRequest } from '../middleware/validateRequest.middleware.js'

const router = express.Router()

// Public routes
router.get('/', getMovies)
router.get('/:id', getMovie)

// Protected routes (require authentication)
router.post('/', authMiddleware, validateRequest(createMovieSchema), createMovie)
router.put('/:id', authMiddleware, validateRequest(updateMovieSchema), updateMovie)
router.delete('/:id', authMiddleware, deleteMovie)

export default router
