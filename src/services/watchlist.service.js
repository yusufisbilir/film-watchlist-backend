import { prisma } from '../config/db.js'
import { WatchlistItemStatus } from '../generated/prisma/index.js'

export const addToWatchlist = async ({ userId, movieId, status, rating, notes }) => {
    // validation
    const movie = await prisma.movie.findUnique({
        where: { id: movieId },
    })
    if (!movie) {
        throw new Error('Movie not found')
    }

    // check if movie is already in watchlist
    const existingInWatchlist = await prisma.watchlistItem.findUnique({
        where: { userId_movieId: { userId, movieId } },
    })

    if (existingInWatchlist) {
        throw new Error('Movie already in watchlist')
    }

    return await prisma.watchlistItem.create({
        data: { userId, movieId, status: status || WatchlistItemStatus.PLANNED, rating, notes },
    })
}

export const getWatchlistItems = async (userId) => {
    return await prisma.watchlistItem.findMany({
        where: { userId },
        include: {
            movie: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    })
}

export const getWatchlistItemById = async ({ watchlistItemId, userId }) => {
    const watchlistItem = await prisma.watchlistItem.findUnique({
        where: { id: watchlistItemId },
        include: {
            movie: true,
        },
    })

    if (!watchlistItem) {
        throw new Error('Watchlist item not found')
    }

    if (watchlistItem.userId !== userId) {
        throw new Error('Not allowed to access this watchlist item')
    }

    return watchlistItem
}

export const updateWatchlistItem = async ({ watchlistItemId, userId, updateData }) => {
    const watchlistItem = await prisma.watchlistItem.findUnique({
        where: { id: watchlistItemId },
    })

    if (!watchlistItem) {
        throw new Error('Watchlist item not found')
    }

    if (watchlistItem.userId !== userId) {
        throw new Error('Not allowed to update this watchlist item')
    }

    return await prisma.watchlistItem.update({
        where: { id: watchlistItemId },
        data: updateData,
    })
}

export const removeFromWatchlist = async ({ watchlistItemId, userId }) => {
    const watchlistItem = await prisma.watchlistItem.findUnique({
        where: { id: watchlistItemId },
    })

    if (!watchlistItem) {
        throw new Error('Watchlist item not found')
    }

    if (watchlistItem.userId !== userId) {
        throw new Error('Not allowed to update this watchlist item')
    }

    await prisma.watchlistItem.delete({
        where: { id: watchlistItemId },
    })
}
