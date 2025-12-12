import { prisma, connectDB, disconnectDB } from '../src/config/db.js'

const creatorId = 'aac3b593-14c6-4315-b05e-9dc0117a74441'
const creatorEmail = 'demo@watchlist.local'
const creatorName = 'Demo User'

const movies = [
  {
    title: 'Inception',
    overview:
      'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    releaseYear: 2010,
    genres: ['Sci-Fi'],
    runtime: 148,
    posterUrl: 'https://example.com/inception.jpg',
    createdBy: creatorId,
  },
  {
    title: 'The Dark Knight',
    overview:
      'When the menace known as the Joker emerges from his mysterious past, he wreaks havoc and chaos on the people of Gotham. The Dark Knight must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    releaseYear: 2008,
    genres: ['Action'],
    runtime: 152,
    posterUrl: 'https://example.com/dark-knight.jpg',
    createdBy: creatorId,
  },
]

const seed = async () => {
  await connectDB()

  // Ensure the creator exists before inserting movies to satisfy the FK
  const creator = await prisma.user.upsert({
    where: { email: creatorEmail },
    update: {},
    create: {
      id: creatorId,
      name: creatorName,
      email: creatorEmail,
      password: 'placeholder-password', // replace after adding proper hashing/fixtures
    },
  })

  // Optional: clear existing movies to keep seeding idempotent for dev
  await prisma.movie.deleteMany({ where: { createdBy: creator.id } })

  await Promise.all(
    movies.map((movie) =>
      prisma.movie.create({
        data: { ...movie, createdBy: creator.id },
      })
    )
  )
}

seed()
  .then(async () => {
    console.log('Seeding completed.')
  })
  .catch(async (e) => {
    console.error('Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await disconnectDB()
  })
