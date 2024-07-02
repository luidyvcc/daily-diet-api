import { randomUUID } from 'node:crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'

export const mealsRoutes = async (app: FastifyInstance) => {
  // Create
  app.post('/', async (request, reply) => {
    const createMealBodySchema = z.object({
      name: z.string().min(3).max(255),
      description: z.string().min(3).max(255),
      date: z.string().datetime(),
      isDiet: z.boolean(),
    })

    const { name, description, date, isDiet } = createMealBodySchema.parse(
      request.body,
    )

    const userId = request.cookies.userId
    if (!userId) return reply.status(401).send({ message: 'Unauthorized' })

    const newMeal = await knex('meal')
      .insert({
        id: randomUUID(),
        user_id: userId,
        name,
        description,
        date: new Date(date),
        is_diet: isDiet,
      })
      .returning('*')
      .then(([meal]) => meal)

    return reply.status(201).send(newMeal)
  })

  // Read (all)
  app.get('/', async (request, reply) => {
    const userId = request.cookies.userId
    if (!userId) return reply.status(401).send({ message: 'Unauthorized' })

    const meals = await knex('meal').where({ user_id: userId })

    return reply.status(200).send(meals)
  })

  // Update
  app.patch('/:mealId', async (request, reply) => {
    console.log('\n\n request.body: ', request.body)
    const updateMealBodySchema = z.object({
      name: z.string().min(3).max(255).optional(),
      description: z.string().min(3).max(255).optional(),
      date: z.string().datetime().optional(),
      isDiet: z.boolean().optional(),
    })
    const mealIdParamSchema = z.object({
      mealId: z.string().uuid(),
    })

    const { name, description, date, isDiet } = updateMealBodySchema.parse(
      request.body,
    )
    console.log('\n\n asdf')

    const userId = request.cookies.userId
    if (!userId) return reply.status(401).send({ message: 'Unauthorized' })

    const { mealId } = mealIdParamSchema.parse(request.params)
    console.log('\n\n mealId: ', mealId)

    const [updatedMeal] = await knex('meal')
      .where({ id: mealId, user_id: userId })
      .update({
        name: name || undefined,
        description: description || undefined,
        date: date ? new Date(date) : undefined,
        is_diet: isDiet || undefined,
      })
      .returning('*')

    if (!updatedMeal)
      return reply.status(404).send({ message: 'Meal not found' })

    return reply.status(200).send(updatedMeal)
  })
}
