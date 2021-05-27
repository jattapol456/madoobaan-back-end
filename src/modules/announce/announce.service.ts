import { BaseService } from '@modules/base/base.service';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Announce, AnnounceDocument } from '@schemas/announce.schema';
import { Model, PaginateModel } from 'mongoose';

interface IpaginateAnnounce {
  limit: number;
  page?: number;
}

interface IinsertAnnounce {
  type: string;
  houseNumber: string;
  moo: string;
  soi: string;
  road: string;
  province: string;
  district: string;
  subdistrict: string;
  provinceName: string;
  districtName: string;
  subDistrictName: string;
  zipcode: number;
  zipcodeName: string;
  floor: string;
  bedroom: string;
  bathroom: string;
  parking: string;
  direction: string;
  furniture: string;
  rai: string;
  ngan: string;
  squareWa: string;
  squareMeter: string;
  salePrice: number;
  rentalCommonfee: string;
  roomStatus: string;
  agent: string;
  commonFee: string[];
  security: string[];
  facilities: string[];
  topicName: string;
  moreDetails: string;
  coverPhoto: string;
  photo: string[];
}

interface IsearchAnnounces {
  type?: string;
  provinceName?: string;
  topicName?: string;
}

interface IsortAnnounces {
  limit: number;
  page?: number;
  sort: string;
  type: string;
  email: string;
}

@Injectable()
export class AnnounceService extends BaseService<AnnounceDocument> {
  constructor(
    @InjectModel(Announce.name) private announceModel: Model<AnnounceDocument>,
    @InjectModel(Announce.name) private announcePaginationModel: PaginateModel<AnnounceDocument>,
  ) {
    super(announceModel);
  }

  async insertAnnounce(arg: IinsertAnnounce): Promise<AnnounceDocument> {
    return await this.announceModel.create(arg);
  }

  async findAnnouncesByNameAndTypeAndProvince(arg: IsearchAnnounces): Promise<AnnounceDocument[]> {
    console.log(arg);
    return await this.announceModel.find({
      $or: [
        {
          type: {
            $regex: arg.type,
          },
          provinceName: {
            $regex: arg.provinceName,
          },
          topicName: {
            $regex: arg.topicName,
          },
        },
      ],
    });
  }

  async sortAnnounces(arg: IsortAnnounces): Promise<AnnounceDocument[]> {
    const options = {
      limit: arg.limit!,
      page: arg.page!,
      sort: arg.sort!,
    };
    const { docs } = await this.announcePaginationModel.paginate(
      {
        $or: [
          {
            type: {
              $regex: arg.type,
            },
            email: {
              $regex: arg.email,
            }
          },
        ],
      },
      options,
    );
    return docs;
  }

  async paginateAnnounces(arg: IpaginateAnnounce): Promise<AnnounceDocument[]> {
    const options = {
      limit: arg.limit!,
      page: arg.page!,
    };
    const { docs } = await this.announcePaginationModel.paginate({}, options);
    return docs;
  }
}
