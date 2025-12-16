import { prisma } from '../config/db.js'

export const addToWatchlist = async (req, res) => {
  try {
    const { movieId, status, rating, notes, userId } = req.body

    // validation
    const movie = await prisma.movie.findUnique({
      where: { id: movieId },
    })
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      })
    }

    // check if movie is already in watchlist
    const existingInWatchlist = await prisma.watchlistItem.findUnique({
      where: { userId_movieId: { userId, movieId } },
    })

    if (existingInWatchlist) {
      return res.status(400).json({
        success: false,
        message: 'Movie already in watchlist',
      })
    }

    const watchListItem = await prisma.watchlistItem.create({
      data: { userId, movieId, status: status || WatchlistItemStatus.PLANNED, rating, notes },
    })

    res.status(201).json({
      success: true,
      message: 'Movie added to watchlist',
      data: { watchListItem },
    })
  } catch (error) {
    console.error('Add to watchlist error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to add to watchlist',
    })
  }
}
