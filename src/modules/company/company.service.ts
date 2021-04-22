import { Model } from 'mongoose'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { BaseService } from '@modules/base/base.service'
import { Company, CompanyDocument } from '@schemas/company.schema'
import { User, UserDocument } from '@schemas/user.schema'
import { AdminRole } from 'src/constants/user'
import { RequireAtLeastOne } from 'src/types'
import { CreateCompanyDto, PartialCompanyDto } from './company.dto'
import { UserCompanyService } from '@modules/user-company/user-company.service'

@Injectable()
export class CompanyService extends BaseService<CompanyDocument> {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private userCompanyService: UserCompanyService,
  ) {
    super(companyModel)
  }

  async findOne(data: RequireAtLeastOne<Company>): Promise<CompanyDocument> {
    return this.companyModel.findOne(data as Company)
  }

  async findOneById(id: number): Promise<CompanyDocument> {
    return this.companyModel
      .findOne({ id })
      .populate({
        path: 'admins',
        model: 'UserCompany',
      })
      .exec()
  }

  async createCompany(data: CreateCompanyDto, user: UserDocument): Promise<CompanyDocument> {
    return await this.companyModel
      .create({ ...data })
      .then((company) =>
        this.userCompanyService.create({
          user: user._id,
          company: company._id,
          role: AdminRole.OWNER,
        }),
      )
      .then((userCompanyDocument) =>
        userCompanyDocument
          .populate({ path: 'user', model: 'User', select: '-_id -__v' })
          .populate({ path: 'company', model: 'Company', select: '-_id -__v' })
          .execPopulate(),
      )
      .then((result) => result.company as CompanyDocument)
  }

  async updateCompany(id: number, data: PartialCompanyDto): Promise<CompanyDocument> {
    return new Promise((resolve, reject) => {
      this.companyModel.findOneAndUpdate({ id: id }, data, { new: true }, (err, company) => {
        if (err) reject(err)
        if (company) resolve(company)
        else throw new NotFoundException()
      })
    })
  }
}
