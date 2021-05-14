import { OmitType, PartialType, PickType } from '@nestjs/swagger'
import { Exclude } from 'class-transformer'
import { IsString, IsObject } from 'class-validator'
import { IEditable } from 'src/types'

export class AnnounceDto {
    @IsString()
    type!: string
  
    @IsString()
    project?: string

    @IsString()
    province!: string

    @IsString()
    district!: string

    @IsString()
    subdistrict!: string

    @IsString()
    zipcode!: string

    @IsString()
    houseNumber!: string

    @IsString()
    swine!: string

    @IsString()
    alley!: string

    @IsString()
    road!: string

    @IsString()
    contactPersonName?: string
 
    @IsString()
    phoneNumber?: string
 
    @IsString()
    email?: string
 
    @IsString()
    facebook?: string
 
    @IsString()
    lineId?: string
 
    @IsString()
    numberLayers?: string
    
    @IsString()
    numberBedroom?: string
    
    @IsString()
    numberToilet?: string
    
    @IsString()
    numberParking?: string
    
    @IsString()
    homeDirection?: string
    
    @IsString()
    furniture?: string
    
    @IsString()
    salePrnumberRaiice?: string

    @IsString()
    number_tasks?: string

    @IsString()
    numberSquareWah?: string

    @IsString()
    numberSquareMeters?: string

    @IsString()
    salePrice?: string
  
    @IsString()
    rentalCommonfeeToMonth?: string
  
    @IsString()
    roomStatus?: string
  
    @IsString()
    agent?: string
  
    @IsString()
    commonFee?: string[]
  
    @IsString()
    security?: string[]
  
    @IsString()
    exerciseFacilities?: string[]
  
    @IsString()
    topicName!: string
  
    @IsString()
    announcementCode!: string
  
    @IsString()
    moreDetails!: string
  
    @IsString()
    coverPhoto!: string
  
    @IsString()
    photo?: string
}

export class SimpleAnnounceDto extends AnnounceDto {
  constructor(announce: SimpleAnnounceDto) {
    super()
    Object.assign(this, announce)
  }

  @Exclude()
  _id: any
}

export class EditableSimpleUserRequestDto extends PartialType(OmitType(AnnounceDto, [])) {}

export class EditableSimpleAnnounceDto extends SimpleAnnounceDto implements IEditable {
  constructor(announce: EditableSimpleAnnounceDto) {
    super(announce)
    Object.assign(this, announce)
  }

  editable!: boolean
}

export class AnnounceSetupDto extends PickType(SimpleAnnounceDto, []) {}
