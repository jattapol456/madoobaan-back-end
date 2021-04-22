import { Model, Types } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { BaseService } from '@modules/base/base.service'
import { User, UserDocument } from '@schemas/user.schema'

@Injectable()
export class UserService extends BaseService<UserDocument> {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    super(userModel)
  }

  async findByIdIn(users: Types.ObjectId[]): Promise<UserDocument[]> {
    return await this.userModel.find({
      _id: {
        $in: users,
      },
    })
  }
}
