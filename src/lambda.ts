import serverlessExpress from '@codegenie/serverless-express'
import type { Handler } from 'aws-lambda'
import { createApp } from './create-app'

// Reuse the Nest app across warm invocations
let server: Handler | undefined

async function bootstrap(): Promise<Handler> {
  const app = await createApp()
  await app.init()
  return serverlessExpress({ app: app.getHttpAdapter().getInstance() })
}

export const handler: Handler = async (event, context, callback) => {
  server ??= await bootstrap()
  return server(event, context, callback)
}
