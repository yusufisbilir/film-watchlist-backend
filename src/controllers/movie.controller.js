import { prisma } from '../config/db.js'

export const createMovie = async (req, res) => {
  try {
    const { title, overview, releaseYear, genres, runtime, posterUrl } = req.body
    const userId = req.user.id

    const movie = await prisma.movie.create({
      data: {
        title,
        overview,
        releaseYear,
        genres: genres || [],
        runtime,
        posterUrl,
        createdBy: userId,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
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
    const { page = 1, limit = 10, search, year, genre } = req.query
    const skip = (parseInt(page) - 1) * parseInt(limit)

    const where = {}
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { overview: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (year) {
      where.releaseYear = parseInt(year)
    }
    if (genre) {
      where.genres = { has: genre }
    }

    const [movies, total] = await Promise.all([
      prisma.movie.findMany({
        where,
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: parseInt(limit),
      }),
      prisma.movie.count({ where }),
    ])

    res.status(200).json({
      success: true,
      data: {
        movies,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      },
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
    const movieId = req.params.id

    const movie = await prisma.movie.findUnique({
      where: { id: movieId },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      })
    }

    res.status(200).json({
      success: true,
      data: { movie },
    })
  } catch (error) {
    console.error('Get movie error:', error)
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

    const movie = await prisma.movie.findUnique({
      where: { id: movieId },
    })

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      })
    }

    if (movie.createdBy !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not allowed to update this movie',
      })
    }

    const updatedMovie = await prisma.movie.update({
      where: { id: movieId },
      data: {
        ...(title !== undefined && { title }),
        ...(overview !== undefined && { overview }),
        ...(releaseYear !== undefined && { releaseYear }),
        ...(genres !== undefined && { genres }),
        ...(runtime !== undefined && { runtime }),
        ...(posterUrl !== undefined && { posterUrl }),
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    res.status(200).json({
      success: true,
      message: 'Movie updated successfully',
      data: { movie: updatedMovie },
    })
  } catch (error) {
    console.error('Update movie error:', error)
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

    const movie = await prisma.movie.findUnique({
      where: { id: movieId },
    })

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      })
    }

    if (movie.createdBy !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not allowed to delete this movie',
      })
    }

    await prisma.movie.delete({
      where: { id: movieId },
    })

    res.status(200).json({
      success: true,
      message: 'Movie deleted successfully',
    })
  } catch (error) {
    console.error('Delete movie error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete movie',
    })
  }
}
