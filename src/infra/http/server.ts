import { env } from '@/env'
import { fastifyCors } from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { fastify } from 'fastify'
import {
	hasZodFastifySchemaValidationErrors,
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
} from 'fastify-type-provider-zod'
import { deckRoute } from './routes/deckRoutes'

const server = fastify()

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.setErrorHandler((error, request, reply) => {
	if (hasZodFastifySchemaValidationErrors(error)) {
		return reply.status(400).send({
			statusCode: 400,
			message: 'Validation error',
			issues: error.validation,
		})
	}

	// Enviar o erro para alguma ferramenta de observabilidade

	console.error(error)
	return reply.status(500).send({ message: 'Internal server error.' })
})

server.register(fastifyCors, { origin: '*' })

server.register(fastifySwagger, {
	openapi: {
		info: {
			title: 'Flashcards',
			version: '1.0.0',
		},
	},
	transform: jsonSchemaTransform,
})
server.register(fastifySwaggerUi, {
	routePrefix: '/documentation',
})
server.register(deckRoute)

server.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
	console.log('HTTP server running')
})
