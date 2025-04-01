import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const deckRoute: FastifyPluginAsyncZod = async server => {
	server.post(
		'/decks',
		{
			schema: {
				summary: 'Create a new deck',
				body: z.object({
					name: z.string().min(1).max(100),
					description: z.string().optional(),
				}),
				response: {
					201: z.object({ id: z.string() }),
				},
			},
		},
		async (request, reply) => {
			return reply.status(201).send({ id: 'deck-id' })
		}
	)
}
