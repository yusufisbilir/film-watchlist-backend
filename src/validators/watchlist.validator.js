import { z } from 'zod'
export const addToWatchlistSchema = z.object({
  movieId: z.uuid(),
  status: z
    .enum(['PLANNED', 'WATCHING', 'COMPLETED', 'DROPPED'], {
      error: () => ({
        message: 'Status is required and must be one of the following: PLANNED, WATCHING, COMPLETED, DROPPED',
      }),
    })
    .optional(),
  rating: z
    .number()
    .min(1, { message: 'Rating must be between 1 and 10' })
    .max(10, { message: 'Rating must be between 1 and 10' })
    .optional(),
  notes: z
    .string()
    .min(1, { message: 'Notes is required' })
    .max(2000, { message: 'Notes must be less than 2000 characters' })
    .optional(),
})
