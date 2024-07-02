import { FastifyReply, FastifyRequest } from 'fastify'

export const checkAuthUserExists = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const authUser = request.cookies.authUser

  if (!authUser) {
    reply.code(401).send({ message: 'User not authenticated' })
  }
}
