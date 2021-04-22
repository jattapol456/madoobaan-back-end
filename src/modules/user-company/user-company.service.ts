import { Model, ObjectId, Types } from 'mongoose'
import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { BaseService } from '@modules/base/base.service'
import { UserCompany, UserCompanyDocument } from '@schemas/user-company.schema'
import { UserDocument } from '@schemas/user.schema'
import { CompanyDocument } from '@schemas/company.schema'
import { AdminRole } from 'src/constants/user'
import { Action } from 'src/constants/action'
import { CaslAbilityFactory } from '@modules/casl/casl-ability.factory'
import { BaseDocument } from '@schemas/base.schema'

@Injectable()
export class UserCompanyService extends BaseService<UserCompanyDocument> {
  constructor(
    @InjectModel(UserCompany.name) private userCompanyModel: Model<UserCompanyDocument>,
    private caslAbilityService: CaslAbilityFactory,
  ) {
    super(userCompanyModel)
  }

  async findAllByUserId(user: Types.ObjectId): Promise<UserCompanyDocument[]> {
    return await this.userCompanyModel.find({ user: user }).populate('user').populate('company').exec()
  }

  async findAllByCompanyId(company: Types.ObjectId): Promise<UserCompanyDocument[]> {
    return await this.userCompanyModel.find({ company: company })
  }

  async findOneBy(user: Partial<UserCompany>): Promise<UserCompanyDocument> {
    return await (await super.findOne(user as UserCompany)).populate('user').populate('company').execPopulate()
  }

  async checkPermission(user: UserDocument, company: CompanyDocument, role: AdminRole): Promise<boolean> {
    const result = (await this.userCompanyModel.findOne({
      user: user._id,
      company: company._id,
    })) as UserCompanyDocument
    return result.role == role
  }

  async isOwner(user: UserDocument, company: CompanyDocument): Promise<boolean> {
    return await this.checkPermission(user, company, AdminRole.OWNER)
  }

  async isAdmin(user: UserDocument, company: CompanyDocument): Promise<boolean> {
    return await this.checkPermission(user, company, AdminRole.ADMIN)
  }

  async isEditor(user: UserDocument, company: CompanyDocument): Promise<boolean> {
    return await this.checkPermission(user, company, AdminRole.EDITOR)
  }

  async existsUserAndCompany(user: UserDocument, company: CompanyDocument): Promise<boolean> {
    return await this.userCompanyModel.exists({ user: user._id, company: company._id })
  }
}
