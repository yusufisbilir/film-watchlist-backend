import * as movieService from '../services/movie.service.js'

export const createMovie = async (req, res) => {
  try {
    const { title, overview, releaseYear, genres, runtime, posterUrl } = req.body
    const userId = req.user.id

    const movie = await movieService.createMovie({
      title,
      overview,
      releaseYear,
      genres,
      runtime,
      posterUrl,
      userId,
    })

    res.status(201).json({
      success: true,
      message: 'Movie created successfully',
      data: { movie },
    })
  } catch (error) {
    console.error('Create movie error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create movie',
    })
  }
}

export const getMovies = async (req, res) => {
  try {
    const result = await movieService.getMovies(req.query)

    res.status(200).json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Get movies error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get movies',
    })
  }
}

export const getMovie = async (req, res) => {
  try {
    const movie = await movieService.getMovieById(req.params.id)

    res.status(200).json({
      success: true,
      data: { movie },
    })
  } catch (error) {
    console.error('Get movie error:', error)
    if (error.message === 'Movie not found') {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      })
    }
    res.status(500).json({
      success: false,
      message: 'Failed to get movie',
    })
  }
}

export const updateMovie = async (req, res) => {
  try {
    const { title, overview, releaseYear, genres, runtime, posterUrl } = req.body
    const userId = req.user.id
    const movieId = req.params.id

    const updateData = {}
    if (title !== undefined) updateData.title = title
    if (overview !== undefined) updateData.overview = overview
    if (releaseYear !== undefined) updateData.releaseYear = releaseYear
    if (genres !== undefined) updateData.genres = genres
    if (runtime !== undefined) updateData.runtime = runtime
    if (posterUrl !== undefined) updateData.posterUrl = posterUrl

    const updatedMovie = await movieService.updateMovie({
      movieId,
      userId,
      updateData,
    })

    res.status(200).json({
      success: true,
      message: 'Movie updated successfully',
      data: { movie: updatedMovie },
    })
  } catch (error) {
    console.error('Update movie error:', error)
    if (error.message === 'Movie not found') {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      })
    }
    if (error.message === 'Not allowed to update this movie') {
      return res.status(403).json({
        success: false,
        message: 'Not allowed to update this movie',
      })
    }
    res.status(500).json({
      success: false,
      message: 'Failed to update movie',
    })
  }
}

export const deleteMovie = async (req, res) => {
  try {
    const userId = req.user.id
    const movieId = req.params.id

    await movieService.deleteMovie({ movieId, userId })

    res.status(200).json({
      success: true,
      message: 'Movie deleted successfully',
    })
  } catch (error) {
    console.error('Delete movie error:', error)
    if (error.message === 'Movie not found') {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      })
    }
    if (error.message === 'Not allowed to delete this movie') {
      return res.status(403).json({
        success: false,
        message: 'Not allowed to delete this movie',
      })
    }
    res.status(500).json({
      success: false,
      message: 'Failed to delete movie',
    })
  }
}
