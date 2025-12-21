import { z } from 'zod'

export const createMovieSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title is required' })
    .max(200, { message: 'Title must be less than 200 characters' }),
  overview: z.string().max(5000, { message: 'Overview must be less than 5000 characters' }).optional(),
  releaseYear: z
    .number()
    .int({ message: 'Release year must be an integer' })
    .min(1888, { message: 'Release year must be 1888 or later' })
    .max(new Date().getFullYear() + 10, { message: 'Release year cannot be more than 10 years in the future' }),
  genres: z
    .array(z.string().min(1, { message: 'Genre cannot be empty' }))
    .max(20, { message: 'Cannot have more than 20 genres' })
    .optional(),
  runtime: z
    .number()
    .int({ message: 'Runtime must be an integer' })
    .positive({ message: 'Runtime must be a positive number' })
    .max(1000, { message: 'Runtime must be less than 1000 minutes' })
    .optional(),
  posterUrl: z
    .string()
    .url({ message: 'Poster URL must be a valid URL' })
    .max(500, { message: 'Poster URL must be less than 500 characters' })
    .optional(),
})

export const updateMovieSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title cannot be empty' })
    .max(200, { message: 'Title must be less than 200 characters' })
    .optional(),
  overview: z.string().max(5000, { message: 'Overview must be less than 5000 characters' }).optional(),
  releaseYear: z
    .number()
    .int({ message: 'Release year must be an integer' })
    .min(1888, { message: 'Release year must be 1888 or later' })
    .max(new Date().getFullYear() + 10, { message: 'Release year cannot be more than 10 years in the future' })
    .optional(),
  genres: z
    .array(z.string().min(1, { message: 'Genre cannot be empty' }))
    .max(20, { message: 'Cannot have more than 20 genres' })
    .optional(),
  runtime: z
    .number()
    .int({ message: 'Runtime must be an integer' })
    .positive({ message: 'Runtime must be a positive number' })
    .max(1000, { message: 'Runtime must be less than 1000 minutes' })
    .optional(),
  posterUrl: z
    .string()
    .url({ message: 'Poster URL must be a valid URL' })
    .max(500, { message: 'Poster URL must be less than 500 characters' })
    .optional(),
})
