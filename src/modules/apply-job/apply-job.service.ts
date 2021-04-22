import { BaseService } from '@modules/base/base.service'
import { CaslAbilityFactory } from '@modules/casl/casl-ability.factory'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { ApplyJob, ApplyJobDocument } from '@schemas/apply-job.schema'
import { JobDocument } from '@schemas/job.schema'
import { UserDocument } from '@schemas/user.schema'
import { Model, PaginateModel, PaginateResult, Types } from 'mongoose'

@Injectable()
export class ApplyJobService extends BaseService<ApplyJobDocument> {
  constructor(
    @InjectModel(ApplyJob.name) private applyJobModel: Model<ApplyJobDocument>,
    @InjectModel(ApplyJob.name) private applyJobPaginateModel: PaginateModel<ApplyJobDocument>,
    private caslAbilityService: CaslAbilityFactory,
  ) {
    super(applyJobModel)
  }

  async findAllByJob(job: Types.ObjectId): Promise<ApplyJobDocument[]> {
    return await this.applyJobModel.find({ job: job }).populate('job').populate('user').populate('files')
  }

  async existsUserAndJob(user: UserDocument, job: JobDocument): Promise<boolean> {
    return await this.applyJobModel.exists({ user: user._id, job: job._id })
  }

  async getApplyJobsListPaginate(
    page: number,
    limit: number,
    job?: Types.ObjectId,
  ): Promise<PaginateResult<ApplyJobDocument>> {
    const options = {
      page: page,
      limit: limit,
      populate: ['user', 'job', 'files'],
    }
    return await this.applyJobPaginateModel.paginate({ job: job }, options)
  }
}
