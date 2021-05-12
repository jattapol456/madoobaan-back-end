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
  house_number: string;
  swine: string;
  alley: string;
  road: string;
  contact_person_name: string;
  phone_number: string;
  email: string;
  facebook: string;
  line_id: string;
  number_layers: string;
  number_bedroom: string;
  number_toilet: string;
  number_parking: string;
  home_direction: string;
  furniture: string;
  number_rai: string;
  number_tasks: string;
  number_Square_wah: string;
  number_Square_meters: string;
  sale_price: string;
  rental_commonfee_to_month: string;
  room_status: string;
  agent: string;
  common_fee: string[];
  security: string[];
  exercise_facilities: string[];
  topic_name: string;
  announcement_code: string;
  more_details: string;
  cover_photo: string;
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
