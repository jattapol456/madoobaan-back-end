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
  type: string;
  project: string;
  province: string;
  district: string;
  subdistrict: string;
  zipcode: string;
  houseNumber: string;
  swine: string;
  alley: string;
  road: string;
  contactPersonName: string;
  phone_number: string;
  email: string;
  facebook: string;
  lineId: string;
  numberLayers: string;
  numberBedroom: string;
  numberToilet: string;
  numberParking: string;
  homeDirection: string;
  furniture: string;
  numberRai: string;
  numberTasks: string;
  numberSquareWah: string;
  numberSquareMeters: string;
  salePrice: string;
  rentalCommonfeeToMonth: string;
  roomStatus: string;
  agent: string;
  commonFee: string[];
  security: string[];
  exerciseFacilities: string[];
  topicName: string;
  announcementCode: string;
  moreDetails: string;
  coverPhoto: string;
  photo: string;
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
