import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { AppModule } from './app.module'

import * as admin from 'firebase-admin'
import { ServiceAccount } from 'firebase-admin'
import { ValidationPipe } from '@nestjs/common'
import fmp from 'fastify-multipart'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true,
    }),
    {
      cors: true,
    },
  )
  app.register(fmp, {
    attachFieldsToBody: true,
    // limits: {
    //   fieldNameSize: 100, // Max field name size in bytes
    //   fieldSize: 1000000, // Max field value size in bytes
    //   fields: 10, // Max number of non-file fields
    //   fileSize: 100, // For multipart forms, the max file size
    //   headerPairs: 2000, // Max number of header key=>value pairs
    // },
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )

  const adminConfig: ServiceAccount = {
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    projectId: process.env.FIREBASE_PROJECT_ID,
  }

  admin.initializeApp({
    credential: admin.credential.cert(adminConfig),
    databaseURL: 'https://jobbee-dev-default-rtdb.firebaseio.com/',
    storageBucket: process.env.FIREBASE_PROJECT_ID + '.appspot.com',
  })

  await app.listen(
    process.env.NODE_ENV == 'production' ? 80 : 3000,
    process.env.NODE_ENV == 'production' ? '0.0.0.0' : 'localhost',
  )
}
bootstrap()
