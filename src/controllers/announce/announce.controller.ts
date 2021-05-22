import { EditSimpleAnnounceDto, SimpleAnnounceDto } from '@modules/announce/announce.dto';
import { AnnounceService } from '@modules/announce/announce.service';
import { FirebaseGuard } from '@modules/auth/firebase.guard';
import { Delete, Put, UseInterceptors } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { Param } from '@nestjs/common';
import { Req } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';
import { FirebaseUserRequest } from 'src/types';

interface IPaginateQuery {
  page?: number;
  limit?: number;
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
  zipcode: string;
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
  salePrice: string;
  rentalCommonfee: string;
  roomStatus: string;
  agent: string;
  commonFee: string[];
  security: string[];
  facilities: string[];
  topicName: string;
  announceCode: string;
  moreDetails: string;
  coverPhoto: string;
  photo: string[];
}

@Controller('announces')
export class AnnounceController {
  constructor(private announceService: AnnounceService) {}

  @Post()
  @UseGuards(FirebaseGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async createAnnounce(
    @Body() insertAnnounce: IinsertAnnounce,
    @Req() req: FirebaseUserRequest,
  ): Promise<SimpleAnnounceDto> {
    if (!req.user) throw new UnauthorizedException();
    return await this.announceService
      .insertAnnounce(insertAnnounce)
      .then((res) => plainToClass(SimpleAnnounceDto, res.toObject()));
  }

  @Get(':id')
  @UseGuards(FirebaseGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async getAnnounceById(@Param('id') id: number, @Req() req: FirebaseUserRequest): Promise<SimpleAnnounceDto> {
    if (!req.user) throw new UnauthorizedException();
    return await this.announceService.findOneById(id).then((res) => plainToClass(SimpleAnnounceDto, res.toObject()));
  }

  @Put(':id')
  @UseGuards(FirebaseGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async updateUserInfo(
    @Req() req: FirebaseUserRequest,
    @Param('id') id: number,
    @Body() edit: EditSimpleAnnounceDto,
  ): Promise<EditSimpleAnnounceDto> {
    if (!req.user) throw new UnauthorizedException();
    return this.announceService.updateOneById(id, edit);
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async getAnnounce(@Req() reqQuery: Request): Promise<SimpleAnnounceDto[]> {
    const { limit = 16, page }: IPaginateQuery = reqQuery.query;
    return await this.announceService
      .paginateAnnounce({ limit, page })
      .then((result) => result.map((res) => plainToClass(SimpleAnnounceDto, res.toObject())));
  }

  @Delete(':id')
  @UseGuards(FirebaseGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async deleteAnnounce(@Param('id') id: number, @Req() req: FirebaseUserRequest) {
    if (!req.user) throw new UnauthorizedException();
    return this.announceService.delete(id);
  }
}
