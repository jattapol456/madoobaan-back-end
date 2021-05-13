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
    houseNumber: string;
    swine: string;
    alley: string;
    road: string;
    contactPersonName: string;
    phoneNumber: string;
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
