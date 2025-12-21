import * as watchlistService from '../services/watchlist.service.js'

export const addToWatchlist = async (req, res) => {
  try {
    const { movieId, status, rating, notes } = req.body
    const userId = req.user.id

    const watchListItem = await watchlistService.addToWatchlist({
      userId,
      movieId,
      status,
      rating,
      notes,
    })

    res.status(201).json({
      success: true,
      message: 'Movie added to watchlist',
      data: { watchListItem },
    })
  } catch (error) {
    console.error('Add to watchlist error:', error)
    if (error.message === 'Movie not found') {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      })
    }
    if (error.message === 'Movie already in watchlist') {
      return res.status(400).json({
        success: false,
        message: 'Movie already in watchlist',
      })
    }
    res.status(500).json({
      success: false,
      message: 'Failed to add to watchlist',
    })
  }
}

export const removeFromWatchlist = async (req, res) => {
  try {
    const userId = req.user.id
    const watchlistItemId = req.params.id

    await watchlistService.removeFromWatchlist({ watchlistItemId, userId })

    res.status(200).json({
      status: 'success',
      message: 'Movie removed from watchlist',
    })
  } catch (error) {
    console.error('Remove from watchlist error:', error)
    if (error.message === 'Watchlist item not found') {
      return res.status(404).json({ error: 'Watchlist item not found' })
    }
    if (error.message === 'Not allowed to update this watchlist item') {
      return res.status(403).json({ error: 'Not allowed to update this watchlist item' })
    }
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

    const updateData = {}
    if (status !== undefined) updateData.status = status
    if (rating !== undefined) updateData.rating = rating
    if (notes !== undefined) updateData.notes = notes

    const updatedWatchlistItem = await watchlistService.updateWatchlistItem({
      watchlistItemId,
      userId,
      updateData,
    })

    res.status(200).json({
      success: true,
      message: 'Watchlist item updated',
      data: { watchlistItem: updatedWatchlistItem },
    })
  } catch (error) {
    console.error('Update watchlist item error:', error)
    if (error.message === 'Watchlist item not found') {
      return res.status(404).json({
        success: false,
        message: 'Watchlist item not found',
      })
    }
    if (error.message === 'Not allowed to update this watchlist item') {
      return res.status(403).json({
        success: false,
        message: 'Not allowed to update this watchlist item',
      })
    }
    res.status(500).json({
      success: false,
      message: 'Failed to update watchlist item',
    })
  }
}

export const getWatchlistItems = async (req, res) => {
  try {
    const userId = req.user.id

    const watchlistItems = await watchlistService.getWatchlistItems(userId)

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

    const watchlistItem = await watchlistService.getWatchlistItemById({
      watchlistItemId,
      userId,
    })

    res.status(200).json({
      success: true,
      data: { watchlistItem },
    })
  } catch (error) {
    console.error('Get watchlist item error:', error)
    if (error.message === 'Watchlist item not found') {
      return res.status(404).json({
        success: false,
        message: 'Watchlist item not found',
      })
    }
    if (error.message === 'Not allowed to access this watchlist item') {
      return res.status(403).json({
        success: false,
        message: 'Not allowed to access this watchlist item',
      })
    }
    res.status(500).json({
      success: false,
      message: 'Failed to get watchlist item',
    })
  }
}
