import { OmitType, PartialType, PickType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsString, IsObject, IsArray, IsNumber } from 'class-validator';
import { IEditable } from 'src/types';

export class AnnounceDto {
  @IsString()
  type!: string;

  @IsString()
  province!: string;

  @IsString()
  district!: string;

  @IsString()
  subdistrict!: string;

  @IsString()
  zipcode!: string;

  @IsString()
  houseNumber!: string;

  @IsString()
  moo!: string;

  @IsString()
  soi!: string;

  @IsString()
  road!: string;

  @IsString()
  floor?: string;

  @IsString()
  bedroom?: string;

  @IsString()
  bathroom?: string;

  @IsString()
  parking?: string;

  @IsString()
  direction?: string;

  @IsString()
  furniture?: string;

  @IsString()
  rai?: string;

  @IsString()
  ngan?: string;

  @IsString()
  squareWa?: string;

  @IsString()
  squareMeter?: string;

  @IsNumber()
  salePrice?: number;

  @IsString()
  rentalCommonfee?: string;

  @IsString()
  roomStatus?: string;

  @IsString()
  agent?: string;

  @IsArray()
  commonFee?: string[];

  @IsArray()
  security?: string[];

  @IsArray()
  facilities?: string[];

  @IsString()
  topicName!: string;

  @IsString()
  moreDetails!: string;

  @IsString()
  coverPhoto!: string;

  @IsArray()
  photo?: string[];
}

export class SimpleAnnounceDto extends AnnounceDto {
  constructor(announce: SimpleAnnounceDto) {
    super();
    Object.assign(this, announce);
  }

  @Exclude()
  _id: any;
}

export class SearchAnnounceDto extends PickType(AnnounceDto, ['type', 'topicName', "province"]) {}

export class EditSimpleAnnounceDto extends (OmitType(AnnounceDto, ['agent'])) {}

export class EditableSimpleUserRequestDto extends PartialType(OmitType(AnnounceDto, [])) {}

export class EditableSimpleAnnounceDto extends SimpleAnnounceDto implements IEditable {
  constructor(announce: EditableSimpleAnnounceDto) {
    super(announce);
    Object.assign(this, announce);
  }

  editable!: boolean;
}

export class AnnounceSetupDto extends PickType(SimpleAnnounceDto, []) {}
