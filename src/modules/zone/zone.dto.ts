import { OmitType, PartialType, PickType } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsInt, IsString} from 'class-validator'
import { IEditable } from 'src/types'

export class ZoneDto {
  @IsString()
  subdistrict_name!: string
  
  @IsInt()
  subdistrict_id!: number

  @IsString()
  img!: string

  @IsString()
  province!: string
  
  @IsInt()
  province_id!: number

  @IsString()
  district!: string
  
  @IsInt()
  district_id!: number

  @IsInt()
  zipcode!: number
}

@Expose()
export class SimpleZoneDto extends ZoneDto {
  constructor(zone: SimpleZoneDto) {
    super()
    Object.assign(this, zone)
  }
}

export class EditableSimpleUserRequestDto extends PartialType(OmitType(ZoneDto, [])) {}

export class EditableSimpleZoneDto extends SimpleZoneDto implements IEditable {
  constructor(zone: EditableSimpleZoneDto) {
    super(zone)
    Object.assign(this, zone)
  }

  editable!: boolean
}

export class ZoneSetupDto extends PickType(SimpleZoneDto, []) {}
