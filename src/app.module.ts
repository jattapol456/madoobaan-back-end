/* eslint-disable @typescript-eslint/no-var-requires */
import { Module } from '@nestjs/common'
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose'
import { AppController } from './app.controller'
import { AppService } from './app.service'

import { UsersController } from '@controllers/users/users.controller'
import { AuthModule } from '@modules/auth/auth.module'
import { UserService } from '@modules/user/user.service'
import { User, UserSchema } from '@schemas/user.schema'

import * as AutoIncrementFactory from 'mongoose-sequence'
import './environments'
import './splash'

import { CaslModule } from '@modules/casl/casl.module'
import { HelperService } from './modules/helper/helper.service'
import { Schema } from 'mongoose'
import { snakeCase } from 'lodash'
import { AnyClass } from '@casl/ability/dist/types/types'

interface IModelSchema {
  model: AnyClass
  schema: Schema
}

const modelSchemas: IModelSchema[] = [
  {
    model: User,
    schema: UserSchema,
  },
]

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB_HOST!, {
      authSource: 'admin',
      user: process.env.DB_USER,
      pass: process.env.DB_PASS,
    }),
    MongooseModule.forFeatureAsync(
      modelSchemas.map((each) => ({
        name: each.model.name,
        useFactory: (connection) => {
          const schema = each.schema
          const AutoIncrement = AutoIncrementFactory(connection)
          schema.plugin(AutoIncrement as any, { id: `${snakeCase(each.model.name)}_counter`, inc_field: 'id' })
          return schema
        },
        inject: [getConnectionToken()],
      })),
    ),
    AuthModule,
    CaslModule,
  ],
  controllers: [AppController, UsersController],
  providers: [AppService, UserService, HelperService],
})
export class AppModule {}
