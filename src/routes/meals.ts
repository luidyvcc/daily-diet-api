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

  // Read (one)
  app.get('/:mealId', async (request, reply) => {
    const userId = request.cookies.userId
    if (!userId) return reply.status(401).send({ message: 'Unauthorized' })

    const paramsSchema = z.object({
      mealId: z.string().uuid(),
    })

    const { mealId } = paramsSchema.parse(request.params)

    const meal = await knex('meal')
      .where({ id: mealId, user_id: userId })
      .first()

    if (!meal) return reply.status(404).send({ message: 'Meal not found' })

    return reply.status(200).send(meal)
  })

  // Update
  app.patch('/:mealId', async (request, reply) => {
    const userId = request.cookies.userId
    if (!userId) return reply.status(401).send({ message: 'Unauthorized' })

    const updateMealBodySchema = z.object({
      name: z.string().min(3).max(255).optional(),
      description: z.string().min(3).max(255).optional(),
      date: z.string().datetime().optional(),
      isDiet: z.boolean().optional(),
    })
    const paramsSchema = z.object({
      mealId: z.string().uuid(),
    })

    const { name, description, date, isDiet } = updateMealBodySchema.parse(
      request.body,
    )
    const { mealId } = paramsSchema.parse(request.params)

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

  // Delete
  app.delete('/:mealId', async (request, reply) => {
    const userId = request.cookies.userId
    if (!userId) return reply.status(401).send({ message: 'Unauthorized' })

    const paramsSchema = z.object({
      mealId: z.string().uuid(),
    })

    const { mealId } = paramsSchema.parse(request.params)

    await knex('meal')
      .where({ id: mealId, user_id: userId })
      .delete()
      .then(() => {
        reply.status(200)
      })
      .catch(() => {
        reply.status(404).send({ message: 'Meal not found' })
      })

    return null
  })

  // Get Metrics
  // Deve ser possível recuperar as métricas de um usuário
  // - Quantidade total de refeições registradas
  // - Quantidade total de refeições dentro da dieta
  // - Quantidade total de refeições fora da dieta
  // - Melhor sequência de refeições dentro da dieta
  app.get('/metrics', async (request, reply) => {
    const userId = request.cookies.userId
    if (!userId) return reply.status(401).send({ message: 'Unauthorized' })

    const meals = await knex('meal').where({ user_id: userId })

    const totalMeals = meals.length
    const dietMeals = meals.filter((meal) => meal.is_diet)
    const totalDietMeals = dietMeals.length
    const totalNotDietMeals = meals.filter((meal) => !meal.is_diet).length

    const { bestSequence: bestDietSequence } = dietMeals.reduce(
      (acc, meal) => {
        if (meal.is_diet) {
          acc.currentSequence += 1
          acc.bestSequence = Math.max(acc.bestSequence, acc.currentSequence)
        } else {
          acc.currentSequence = 0
        }

        return acc
      },
      { bestSequence: 0, currentSequence: 0 },
    )

    return reply.status(200).send({
      totalMeals,
      totalDietMeals,
      totalNotDietMeals,
      bestDietSequence,
    })
  })
}
