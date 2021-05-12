import { OmitType, PartialType, PickType } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsInt, IsString} from 'class-validator'
import { IEditable } from 'src/types'

export class ZoneDto {
  @IsString()
  subdistrictName!: string
  
  @IsInt()
  subdistrictId!: number

  @IsString()
  img!: string

  @IsString()
  province!: string
  
  @IsInt()
  provinceId!: number

  @IsString()
  district!: string
  
  @IsInt()
  districtId!: number

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
