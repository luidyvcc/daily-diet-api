import { randomUUID } from 'node:crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'

export const usersRoutes = async (app: FastifyInstance) => {
  app.post('/register', async (request, reply) => {
    const createUserUserBodySchema = z.object({
      name: z.string().min(3).max(255),
      email: z.string().email(),
    })

    const { name, email } = createUserUserBodySchema.parse(request.body)

    const userId = randomUUID()

    const user = await knex('user')
      .insert({
        id: userId,
        name,
        email,
      })
      .returning('*')
      .then(([user]) => user)

    reply.cookie('userId', userId, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })

    return reply.status(201).send(user)
  })
}
