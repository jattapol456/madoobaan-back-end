import { 
    Post, 
    Get, 
    Controller, 
    ClassSerializerInterceptor, 
    UseInterceptors, 
    Param,
    Req,
    Body
} from '@nestjs/common';
import { ZoneService } from '@modules/zone/zone.service';
import { ZoneDocument } from '@schemas/zone.schema';
import { SimpleZoneDto, ZoneDto } from '@modules/zone/zone.dto';
import { plainToClass } from 'class-transformer';
import { Request} from "express"

interface IPaginateQuery {
    page?: number;
    limit?: number;
}

interface IinsertZone {
    subdistrict_name: string;
    img: string;
    province: string;
    district: string;
  }

@Controller('zones')
export class ZoneController {
    constructor(private zoneService: ZoneService){}

    @Post()
    @UseInterceptors(ClassSerializerInterceptor)
    async createZone(@Body() insertZone: IinsertZone): Promise<ZoneDocument>{
        return await this.zoneService.insertZone(insertZone)
    }

    @Get()
    @UseInterceptors(ClassSerializerInterceptor)
    async getZone(@Req() req: Request): Promise<SimpleZoneDto[]>{
        const {limit = 30, page}: IPaginateQuery = req.query
        return await this.zoneService
            .paginateZone({ limit, page})
            .then((result) => result.map((res)=> plainToClass(SimpleZoneDto, res.toObject())))
    }

}

