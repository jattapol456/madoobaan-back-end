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
    house_number!: string

    @IsString()
    swine!: string

    @IsString()
    alley!: string

    @IsString()
    road!: string

    @IsString()
    contact_person_name?: string
 
    @IsString()
    phone_number?: string
 
    @IsString()
    email?: string
 
    @IsString()
    facebook?: string
 
    @IsString()
    line_id?: string
 
    @IsString()
    number_layers?: string
    
    @IsString()
    number_bedroom?: string
    
    @IsString()
    number_toilet?: string
    
    @IsString()
    number_parking?: string
    
    @IsString()
    home_direction?: string
    
    @IsString()
    furniture?: string
    
    @IsString()
    sale_prnumber_raiice?: string

    @IsString()
    number_tasks?: string

    @IsString()
    number_Square_wah?: string

    @IsString()
    number_Square_meters?: string

    @IsString()
    sale_price?: string
  
    @IsString()
    rental_commonfee_to_month?: string
  
    @IsString()
    room_status?: string
  
    @IsString()
    agent?: string
  
    @IsString()
    common_fee?: string[]
  
    @IsString()
    security?: string[]
  
    @IsString()
    exercise_facilities?: string[]
  
    @IsString()
    topic_name!: string
  
    @IsString()
    announcement_code!: string
  
    @IsString()
    more_details!: string
  
    @IsString()
    cover_photo!: string
  
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
