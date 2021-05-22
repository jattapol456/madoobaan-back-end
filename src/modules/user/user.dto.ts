import { OmitType, PartialType, PickType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsBoolean, IsEmail, IsInt, IsOptional, IsString, IsUrl } from 'class-validator';
import { Types } from 'mongoose';
import { IEditable } from 'src/types';

export class UserDto {
  @IsInt()
  id!: number;

  @IsEmail()
  email!: string;

  @IsBoolean()
  verified!: boolean;

  @IsString()
  firstname!: string;

  @IsString()
  lastname!: string;

  @IsOptional()
  @IsUrl()
  avatar!: string;

  @IsString()
  tel!: string;
  
  @IsString()
  line!: string;

  @IsString()
  facebook!: string;

  updatedAt?: Date;

  createdAt?: Date;

  @Exclude()
  _id?: Types.ObjectId;

  @Exclude()
  __v?: any;
}

export class SimpleUserDto extends UserDto {
  constructor(user: SimpleUserDto) {
    super();
    Object.assign(this, user);
  }
}

export class EditableSimpleUserRequestDto extends PartialType(OmitType(UserDto, ['id', 'verified', 'email'])) {}

export class EditableSimpleUserDto extends SimpleUserDto implements IEditable {
  constructor(user: EditableSimpleUserDto) {
    super(user);
    Object.assign(this, user);
  }

  editable!: boolean;
}

export class UserSetupDto extends PickType(SimpleUserDto, ['firstname', 'lastname', 'tel', 'line', 'facebook',]) {}
