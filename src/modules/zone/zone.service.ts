import { BaseService } from '@modules/base/base.service';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Zone, ZoneDocument } from '@schemas/zone.schema';
import { Model, PaginateModel } from 'mongoose';

interface IpaginateZone {
  limit: number;
  page?: number;
}

interface IinsertZone {
  subdistrictName: string;
  img: string;
  province: string;
  district: string;
  zipcode: number;
  district_id: number;
  province_id: number;
  subdistrict_id: number;
}

@Injectable()
export class ZoneService extends BaseService<ZoneDocument> {
  constructor(
    @InjectModel(Zone.name) private zoneModel: Model<ZoneDocument>,
    @InjectModel(Zone.name) private zonePaginationModel: PaginateModel<ZoneDocument>,
  ) {
    super(zoneModel);
  }

  async insertZone(arg: IinsertZone): Promise<ZoneDocument> {
    return await this.zoneModel.create(arg)
  }


  async paginateZone(arg : IpaginateZone): Promise<ZoneDocument[]> {
    const options = {
      limit: arg.limit!,
      page: arg.page!
    };
    const { docs } = await this.zonePaginationModel.paginate({}, options);
    return docs;
  }
}
