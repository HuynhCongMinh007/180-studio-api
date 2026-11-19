import 'dotenv/config'
import { Logger } from '@nestjs/common'
import { API_PREFIX, createApp } from './create-app'

async function bootstrap() {
  const app = await createApp()

  const port = process.env.PORT ?? 5000
  await app.listen(port)
  Logger.log(
    `Server started at http://localhost:${port}/${API_PREFIX}`,
    'Bootstrap',
  )
}
void bootstrap()
