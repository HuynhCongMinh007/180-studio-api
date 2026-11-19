import serverlessExpress from '@codegenie/serverless-express'
import type { Context } from 'aws-lambda'
import { createApp } from './create-app'

// Lambda (Node 24+) rejects callback-style handlers, so only (event, context) is used
type AsyncHandler = (event: unknown, context: Context) => Promise<unknown>

// Reuse the Nest app across warm invocations
let server: AsyncHandler | undefined

async function bootstrap(): Promise<AsyncHandler> {
  const app = await createApp()
  await app.init()
  return serverlessExpress({
    app: app.getHttpAdapter().getInstance(),
  }) as unknown as AsyncHandler
}

export async function handler(event: unknown, context: Context) {
  server ??= await bootstrap()
  return server(event, context)
}
