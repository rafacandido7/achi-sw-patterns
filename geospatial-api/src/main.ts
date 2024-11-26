import 'dotenv/config'

import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './modules/app.module'

import { env } from './shared/config/env'
import {
  HttpLoggingInterceptor,
  TransformInterceptor,
} from './shared/interceptors'
import { UnauthorizedExceptionFilter } from './shared/filters'

const { apiPort } = env

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })

  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalFilters(new UnauthorizedExceptionFilter())
  app.useGlobalInterceptors(
    new HttpLoggingInterceptor(),
    new TransformInterceptor(),
  )

  app.enableCors()

  const config = new DocumentBuilder()
    .setTitle('Base API')
    .setDescription('BaseApi')
    .addBearerAuth()
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('help', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'method',
    },
  })

  await app.listen(apiPort, () => {
    console.log(
      '\n\x1b[34m\x1b[1m%s\x1b[0m',
      `Listening in port ${apiPort} 🚀!`,
    )
  })
}

bootstrap()
