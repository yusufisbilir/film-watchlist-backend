import { prisma } from '../config/db.js'
import { WatchlistItemStatus } from '../generated/prisma/index.js'

export const addToWatchlist = async (req, res) => {
  try {
    const { movieId, status, rating, notes } = req.body
    const userId = req.user.id

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

export const removeFromWatchlist = async (req, res) => {
  try {
    const watchlistItem = await prisma.watchlistItem.findUnique({
      where: { id: req.params.id },
    })

    if (!watchlistItem) {
      return res.status(404).json({ error: 'Watchlist item not found' })
    }

    if (watchlistItem.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not allowed to update this watchlist item' })
    }

    await prisma.watchlistItem.delete({
      where: { id: req.params.id },
    })

    res.status(200).json({
      status: 'success',
      message: 'Movie removed from watchlist',
    })
  } catch (error) {
    console.error('Remove from watchlist error:', error)
    res.status(500).json({
      error: 'Failed to remove movie from watchlist',
    })
  }
}

export const updateWatchlistItem = async (req, res) => {
  try {
    const { status, rating, notes } = req.body
    const userId = req.user.id
    const watchlistItemId = req.params.id

    const watchlistItem = await prisma.watchlistItem.findUnique({
      where: { id: watchlistItemId },
    })

    if (!watchlistItem) {
      return res.status(404).json({
        success: false,
        message: 'Watchlist item not found',
      })
    }

    if (watchlistItem.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not allowed to update this watchlist item',
      })
    }

    const updatedWatchlistItem = await prisma.watchlistItem.update({
      where: { id: watchlistItemId },
      data: {
        ...(status && { status }),
        ...(rating !== undefined && { rating }),
        ...(notes !== undefined && { notes }),
      },
    })

    res.status(200).json({
      success: true,
      message: 'Watchlist item updated',
      data: { watchlistItem: updatedWatchlistItem },
    })
  } catch (error) {
    console.error('Update watchlist item error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update watchlist item',
    })
  }
}

export const getWatchlistItems = async (req, res) => {
  try {
    const userId = req.user.id

    const watchlistItems = await prisma.watchlistItem.findMany({
      where: { userId },
      include: {
        movie: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    res.status(200).json({
      success: true,
      data: { watchlistItems },
    })
  } catch (error) {
    console.error('Get watchlist items error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get watchlist items',
    })
  }
}

export const getWatchlistItem = async (req, res) => {
  try {
    const userId = req.user.id
    const watchlistItemId = req.params.id

    const watchlistItem = await prisma.watchlistItem.findUnique({
      where: { id: watchlistItemId },
      include: {
        movie: true,
      },
    })

    if (!watchlistItem) {
      return res.status(404).json({
        success: false,
        message: 'Watchlist item not found',
      })
    }

    if (watchlistItem.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not allowed to access this watchlist item',
      })
    }

    res.status(200).json({
      success: true,
      data: { watchlistItem },
    })
  } catch (error) {
    console.error('Get watchlist item error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get watchlist item',
    })
  }
}
