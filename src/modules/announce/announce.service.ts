import { BaseService } from '@modules/base/base.service'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Announce, AnnounceDocument } from '@schemas/announce.schema'
import { Model } from 'mongoose'

@Injectable()
export class AnnounceService extends BaseService<AnnounceDocument> {
  constructor(@InjectModel(Announce.name) private announceModel: Model<AnnounceDocument>) {
    super(announceModel)
  }
}
