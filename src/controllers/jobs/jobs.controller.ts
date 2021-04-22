import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor,
  UnauthorizedException,
  ServiceUnavailableException,
  UseGuards,
  Query,
} from '@nestjs/common'

import { CompanyService } from '@modules/company/company.service'
import { FirebaseGuard } from '@modules/auth/firebase.guard'
import { FirebaseUserRequest } from 'src/types'
import { UserService } from '@modules/user/user.service'
import { Action } from 'src/constants/action'
import { HelperService } from '@modules/helper/helper.service'
import { CreateJobDto, JobListDto, JobPaginateDto, ShortJobDto, SimpleJobDto, UpdateJobDto } from '@modules/job/job.dto'
import { JobService } from '@modules/job/job.service'
import { UserCompanyService } from '@modules/user-company/user-company.service'
import { CompanyDocument } from '@schemas/company.schema'
import { plainToClass } from 'class-transformer'
import { ApplyJobService } from '@modules/apply-job/apply-job.service'
import {
  CreateApplyJob,
  SimpleApplyJobDto,
  ApplyJobDetailDto,
  ApplyJobPaginateDto,
} from '@modules/apply-job/apply-job.dto'
import { FileService } from '@modules/file/file.service'
import { emailTemplate } from 'src/constants/emailTemplate'
import { Types } from 'mongoose'
import { SimpleCompanyDto } from '@modules/company/company.dto'
import { SimpleUserDto } from '@modules/user/user.dto'
import { UserDocument } from '@schemas/user.schema'
import { FileDocument } from '@schemas/file.schema'
import { SimpleFileDto } from '@modules/file/file.dto'
import { JobDocument } from '@schemas/job.schema'

@Controller('jobs')
@UseGuards(FirebaseGuard)
export class JobsController {
  constructor(
    private companyService: CompanyService,
    private fileService: FileService,
    private userService: UserService,
    private userCompanyService: UserCompanyService,
    private jobService: JobService,
    private applyJobService: ApplyJobService,
    private helperService: HelperService,
    private userCompanyService: UserCompanyService,
  ) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  async createJob(@Req() req: FirebaseUserRequest, @Body() create: CreateJobDto): Promise<SimpleJobDto> {
    const company = await this.companyService.findOne({ id: create.companyId })
    const reader = await this.userService.findOne({ email: req.user?.email as string })
    if (!this.helperService.can(reader, company, Action.Create)) throw new UnauthorizedException()
    const job = await this.jobService.create({
      company: company,
      ...create,
    })
    return new SimpleJobDto(job.toObject())
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async getJobList(
    @Req() req: FirebaseUserRequest,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('companyId') companyId: number,
  ): Promise<JobPaginateDto> {
    const company = await this.companyService.findOne({ id: companyId })
    const reader = await this.userService.findOne({ email: req.user?.email as string })
    if (!this.helperService.can(reader, company, Action.Manage)) throw new UnauthorizedException()
    const result = await this.jobService.getJobsListPaginate(page, limit, company)
    const job = new JobPaginateDto()
    job.items = result.docs.map((each) => plainToClass(JobListDto, each.toObject()))
    job.total = result.totalDocs
    job.limit = result.limit
    job.totalPages = result.totalPages
    job.page = result.page
    return job
  }

  @Put()
  @UseInterceptors(ClassSerializerInterceptor)
  async updateJob(@Req() req: FirebaseUserRequest, @Body() update: UpdateJobDto): Promise<SimpleJobDto> {
    const job = await this.jobService.findOne({ id: update.id })
    const reader = await this.userService.findOne({ email: req.user?.email as string })
    if (!this.helperService.can(reader, job.company as CompanyDocument, Action.Create))
      throw new UnauthorizedException()
    return new SimpleJobDto((await this.jobService.updateOneById(job.id, update)).toObject())
  }

  @Delete(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async deleteJob(@Req() req: FirebaseUserRequest, @Param('id') id: number): Promise<void> {
    const job = await this.jobService.findOne({ id: id })
    const reader = await this.userService.findOne({ email: req.user?.email as string })
    if (!this.helperService.can(reader, job.company as CompanyDocument, Action.Create))
      throw new UnauthorizedException()
    await this.jobService.delete(job.id)
    return Promise.resolve()
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async getJob(@Req() req: FirebaseUserRequest, @Param('id') id: number): Promise<SimpleJobDto> {
    const job = await this.jobService.findOne({ id: id })
    const reader = await this.userService.findOne({ email: req.user?.email as string })
    return await this.jobService.findOneById(job.id).then(async (job) => {
      let status = ''
      if (await this.userCompanyService.existsUserAndCompany(reader, job.company as CompanyDocument)) {
        status = 'editor'
      } else if (await this.applyJobService.existsUserAndJob(reader, job)) {
        status = 'sent'
      } else {
        status = 'view'
        await this.jobService.updateReadCount(job._id!)
      }
      return new SimpleJobDto({ ...job.toObject(), status: status })
    })
  }

  @Get('/homepage/list')
  @UseInterceptors(ClassSerializerInterceptor)
  async getJobLists(): Promise<ShortJobDto[]> {
    return await (await this.jobService.getAll(30)).map((each) =>
      plainToClass(ShortJobDto, {
        ...each.toObject(),
        company: plainToClass(SimpleCompanyDto, (each.company as CompanyDocument).toObject()),
      }),
    )
  }

  @Post('apply')
  @UseInterceptors(ClassSerializerInterceptor)
  async createApplyJob(@Req() req: FirebaseUserRequest, @Body() dto: CreateApplyJob): Promise<SimpleApplyJobDto> {
    const job = await this.jobService.findOne({ id: dto.jobId })
    const reader = await this.userService.findOne({ email: req.user?.email as string })
    const files = Promise.all(dto.fileIds.map(async (each) => await this.fileService.findOne({ id: each })))
    if (!this.applyJobService.existsUserAndJob(reader, job)) throw new ServiceUnavailableException()
    return await this.applyJobService
      .create({
        job: job._id,
        user: reader._id,
        expectedSalary: dto.expectedSalary,
        introduce: dto.introduce,
        files: (await files).map((each) => each._id!),
      })
      .then(async (applyJob) => {
        await this.helperService.sentEmail(
          (
            await this.userService.findByIdIn(
              (await this.userCompanyService.findAllByCompanyId(job.company as Types.ObjectId)).map(
                (each) => each.user as Types.ObjectId,
              ),
            )
          )
            .map((each) => each.email)
            .filter((value, index, self) => self.indexOf(value) === index),
          emailTemplate.ApplyJOb,
          job.name,
        )
        return new SimpleApplyJobDto(await applyJob.toObject())
      })
  }

  @Get('apply/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async getApplyJob(@Req() req: FirebaseUserRequest, @Param('id') id: number): Promise<ApplyJobDetailDto[]> {
    const job = await this.jobService.findOne({ id: id })
    const reader = await this.userService.findOne({ email: req.user?.email as string })
    if (!this.helperService.can(reader, job.company as CompanyDocument, Action.Read) || job == undefined)
      throw new UnauthorizedException()
    return await this.applyJobService.findAllByJob(job._id!).then((applyJobs) =>
      applyJobs.map((each) =>
        plainToClass(ApplyJobDetailDto, {
          ...each.toObject(),
          user: plainToClass(SimpleUserDto, (each.user as UserDocument).toObject()),
          files: each.files.map((file) => plainToClass(SimpleFileDto, (file as FileDocument).toObject())),
          job: plainToClass(SimpleJobDto, (each.job as JobDocument).toObject()),
        }),
      ),
    )
  }

  @Get('apply/page')
  @UseInterceptors(ClassSerializerInterceptor)
  async getApplyJobList(
    @Req() req: FirebaseUserRequest,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('JobId') JobId: number,
  ): Promise<ApplyJobPaginateDto> {
    const job = await this.jobService.findOne({ id: JobId })
    const reader = await this.userService.findOne({ email: req.user?.email as string })
    if (!this.helperService.can(reader, job.company as CompanyDocument, Action.Manage))
      throw new UnauthorizedException()
    return await this.applyJobService.getApplyJobsListPaginate(page, limit, job._id).then(async (appleJobs) => {
      const jobResponse = new ApplyJobPaginateDto()
      jobResponse.items = await appleJobs.docs.map((each) =>
        plainToClass(ApplyJobDetailDto, {
          ...each.toObject(),
          user: plainToClass(SimpleUserDto, (each.user as UserDocument).toObject()),
          files: each.files.map((file) => plainToClass(SimpleFileDto, (file as FileDocument).toObject())),
        }),
      )
      jobResponse.total = appleJobs.totalDocs
      jobResponse.limit = appleJobs.limit
      jobResponse.totalPages = appleJobs.totalPages
      jobResponse.page = appleJobs.page
      return jobResponse
    })
  }
}
