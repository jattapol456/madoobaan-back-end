import { SimpleAnnounceDto } from '@modules/announce/announce.dto'
import { AnnounceService } from '@modules/announce/announce.service'
import { Delete, Param, UseInterceptors } from '@nestjs/common'
import { Body } from '@nestjs/common'
import { Req } from '@nestjs/common'
import { Get } from '@nestjs/common'
import { Post } from '@nestjs/common'
import { ClassSerializerInterceptor } from '@nestjs/common'
import { Controller } from '@nestjs/common'
import { AnnounceDocument } from '@schemas/announce.schema'
import { plainToClass } from 'class-transformer'
import { Request} from "express"

interface IPaginateQuery {
    page?: number;
    limit?: number;
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

@Controller('announces')
export class AnnounceController {
    constructor(private announceService: AnnounceService){}

    @Post()
    @UseInterceptors(ClassSerializerInterceptor)
    async createAnnounce(@Body() insertAnnounce: IinsertAnnounce): Promise<SimpleAnnounceDto>{
        return await this.announceService.insertAnnounce(insertAnnounce).then((res) => plainToClass(SimpleAnnounceDto, res.toObject()) )
    }

    @Get()
    @UseInterceptors(ClassSerializerInterceptor)
    async getAnnounce(@Req() req: Request): Promise<SimpleAnnounceDto[]>{
        const {limit = 16, page}: IPaginateQuery = req.query
        return await this.announceService
            .paginateAnnounce({ limit, page})
            .then((result) => result.map((res)=> plainToClass(SimpleAnnounceDto, res.toObject())))
    }

}
