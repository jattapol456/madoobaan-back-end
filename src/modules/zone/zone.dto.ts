import { OmitType, PartialType, PickType } from '@nestjs/swagger'
import { Exclude, Expose } from 'class-transformer'
import { IsString} from 'class-validator'
import { IEditable } from 'src/types'

export class ZoneDto {
  @IsString()
  subdistrict_name!: string

  @IsString()
  img!: string

  @IsString()
  province!: string

  @IsString()
  district!: string
}

@Exclude()
export class SimpleZoneDto extends ZoneDto {
  constructor(zone: SimpleZoneDto) {
    super()
    Object.assign(this, zone)
  }

  @Expose()
  subdistrict_name: any
  
  @Expose()
  img: any
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
