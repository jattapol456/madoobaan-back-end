import { Model, PaginateModel, PaginateResult, Types } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { BaseService } from '@modules/base/base.service'
import { CaslAbilityFactory } from '@modules/casl/casl-ability.factory'
import { Job, JobDocument } from '@schemas/job.schema'
import { CompanyDocument } from '@schemas/company.schema'
import { Status } from 'src/constants/index'
import { Resolver } from 'dns'

@Injectable()
export class JobService extends BaseService<JobDocument> {
  constructor(
    @InjectModel(Job.name) private jobModel: Model<JobDocument>,
    @InjectModel(Job.name) private jobPaginateModel: PaginateModel<JobDocument>,
    private caslAbilityService: CaslAbilityFactory,
  ) {
    super(jobModel)
  }

  async getAll(limit: number): Promise<JobDocument[]> {
    return await this.jobModel
      .find({
        $and: [
          {
            status: Status.PUBLISH,
          },
          {
            expiredDate: {
              $gte: new Date(),
            },
          },
        ],
      })
      .limit(limit)
      .sort({ createdAt: 'desc' })
      .populate('company')
      .exec()
  }

  async getJobsListPaginate(
    page: number,
    limit: number,
    company?: CompanyDocument,
  ): Promise<PaginateResult<JobDocument>> {
    const options = {
      page: page,
      limit: limit,
    }
    return await this.jobPaginateModel.paginate({ company: company?._id }, options)
  }

  async updateReadCount(job: Types.ObjectId): Promise<void> {
    await this.jobModel.findOneAndUpdate({ _id: job }, { $inc: { readCount: 1 } })
    return Promise.resolve()
  }
}
