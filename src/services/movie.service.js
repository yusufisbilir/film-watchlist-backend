import { prisma } from '../config/db.js'

export const createMovie = async ({ title, overview, releaseYear, genres, runtime, posterUrl, userId }) => {
  return await prisma.movie.create({
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
}

export const getMovies = async ({ page = 1, limit = 10, search, year, genre }) => {
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

  return {
    movies,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
    },
  }
}

export const getMovieById = async (movieId) => {
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
    throw new Error('Movie not found')
  }

  return movie
}

export const updateMovie = async ({ movieId, userId, updateData }) => {
  const movie = await prisma.movie.findUnique({
    where: { id: movieId },
  })

  if (!movie) {
    throw new Error('Movie not found')
  }

  if (movie.createdBy !== userId) {
    throw new Error('Not allowed to update this movie')
  }

  return await prisma.movie.update({
    where: { id: movieId },
    data: updateData,
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
}

export const deleteMovie = async ({ movieId, userId }) => {
  const movie = await prisma.movie.findUnique({
    where: { id: movieId },
  })

  if (!movie) {
    throw new Error('Movie not found')
  }

  if (movie.createdBy !== userId) {
    throw new Error('Not allowed to delete this movie')
  }

  await prisma.movie.delete({
    where: { id: movieId },
  })
}
