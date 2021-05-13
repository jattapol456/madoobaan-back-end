import { BaseService } from '@modules/base/base.service'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Announce, AnnounceDocument } from '@schemas/announce.schema'
import { Model, PaginateModel } from 'mongoose'

interface IpaginateAnnounce {
  limit: number;
  page?: number;
}

interface IinsertAnnounce {
  type: string
  houseNumber: string
  moo: string
  soi: string
  road: string
  province: string
  district: string
  subdistrict: string
  zipcode: string
  floor: string
  bedroom: string
  bathroom: string
  parking: string
  direction: string
  furniture: string
  rai: string
  ngan: string
  squareWa: string
  squareMeter: string
  salePrice: string
  rentalCommonfee: string
  roomStatus: string
  agent: string
  commonFee: string[]
  security: string[]
  facilities: string[]
  topicName: string
  announceCode: string
  moreDetails: string
  coverPhoto: string
  photo: string
}

@Injectable()
export class AnnounceService extends BaseService<AnnounceDocument> {
  constructor(
    @InjectModel(Announce.name) private announceModel: Model<AnnounceDocument>,
    @InjectModel(Announce.name) private announcePaginationModel: PaginateModel<AnnounceDocument>,
  ) {
    super(announceModel)
  }

  async insertAnnounce(arg: IinsertAnnounce): Promise<AnnounceDocument> {
    return await this.announceModel.create(arg)
  }

  async paginateAnnounce(arg : IpaginateAnnounce): Promise<AnnounceDocument[]> {
    const options = {
      limit: arg.limit!,
      page: arg.page!
    };
    const { docs } = await this.announcePaginationModel.paginate({}, options);
    return docs;
  }

}
