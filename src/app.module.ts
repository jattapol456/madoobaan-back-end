/* eslint-disable @typescript-eslint/no-var-requires */
import { Module } from '@nestjs/common'
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose'
import { AppController } from './app.controller'
import { AppService } from './app.service'

import { UsersController } from '@controllers/users/users.controller'
import { AuthModule } from '@modules/auth/auth.module'
import { UserService } from '@modules/user/user.service'
import { User, UserSchema } from '@schemas/user.schema'

import { CompaniesController } from './controllers/companies/companies.controller'
import { CompanyService } from '@modules/company/company.service'

import * as AutoIncrementFactory from 'mongoose-sequence'
import './environments'
import './splash'

import { Company, CompanySchema } from '@schemas/company.schema'
import { CaslModule } from '@modules/casl/casl.module'
import { UserCompany, UserCompanySchema } from '@schemas/user-company.schema'
import { UserCompanyService } from '@modules/user-company/user-company.service'
import { HelperService } from './modules/helper/helper.service'
import { JobService } from './modules/job/job.service'
import { JobsController } from './controllers/jobs/jobs.controller'
import { Job, JobSchema } from '@schemas/job.schema'
import { Schema } from 'mongoose'
import { snakeCase } from 'lodash'
import { AnyClass } from '@casl/ability/dist/types/types'
import { FilesController } from './controllers/files/files.controller'
import { File, FileSchema } from '@schemas/file.schema'
import { FileService } from './modules/file/file.service'
import { ApplyJobService } from './modules/apply-job/apply-job.service'
import { ApplyJob, ApplyJobSchema } from '@schemas/apply-job.schema'

interface IModelSchema {
  model: AnyClass
  schema: Schema
}

const modelSchemas: IModelSchema[] = [
  {
    model: User,
    schema: UserSchema,
  },
  {
    model: Company,
    schema: CompanySchema,
  },
  {
    model: UserCompany,
    schema: UserCompanySchema,
  },
  {
    model: Job,
    schema: JobSchema,
  },
  {
    model: File,
    schema: FileSchema,
  },
  {
    model: ApplyJob,
    schema: ApplyJobSchema,
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
  controllers: [AppController, UsersController, CompaniesController, JobsController, FilesController],
  providers: [
    AppService,
    UserService,
    CompanyService,
    UserCompanyService,
    HelperService,
    JobService,
    FileService,
    ApplyJobService,
  ],
})
export class AppModule {}
