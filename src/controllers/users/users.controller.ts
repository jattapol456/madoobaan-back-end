import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common'

import { UserService } from '@modules/user/user.service'
import { FirebaseGuard } from '@modules/auth/firebase.guard'
import {
  UserSetupDto,
  SimpleUserDto,
  UserDto,
  EditableSimpleUserDto,
  EditableSimpleUserRequestDto,
} from '@modules/user/user.dto'
import { FirebaseUserRequest } from 'src/types'
import { CaslAbilityFactory } from '@modules/casl/casl-ability.factory'
import { Action } from 'src/constants/action'
import { User } from '@schemas/user.schema'
import { Types } from 'mongoose'
import { plainToClass } from 'class-transformer'
import { FileType } from 'src/constants/fileType'

@Controller('users')
@UseGuards(FirebaseGuard)
export class UsersController {
  constructor(private userService: UserService, private caslAbilityFactory: CaslAbilityFactory) {}

  @Get('me')
  @UseInterceptors(ClassSerializerInterceptor)
  async getMeProfile(@Req() req: FirebaseUserRequest): Promise<SimpleUserDto> {
    if (!req.user) throw new UnauthorizedException()
    const user = await this.userService.findOneOrCreate(
      {
        email: req.user.email as string,
      },
      {
        avatar: req.user.picture as string,
        tel: req.user.phone_number,
      },
    )

    const result = new SimpleUserDto(user.toJSON())
    return result
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async getUserProfile(@Param('id') id: number, @Req() req: FirebaseUserRequest): Promise<EditableSimpleUserDto> {
    const user = await this.userService.findOneById(id)

    const reader = await this.userService.findOne({ email: req.user?.email as string }).catch((e) => {
      if (e instanceof NotFoundException) return null
      throw e
    })

    const ability = this.caslAbilityFactory.createForUser(reader)

    const editable = ability.can(Action.Update, new User(user.toObject())) // Check permission to update for reader

    return new EditableSimpleUserDto({
      ...user.toJSON(),
      editable,
    })
  }

  @Put('me')
  @UseGuards(FirebaseGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async updateMeProfile(@Req() req: FirebaseUserRequest, @Body() user: UserSetupDto): Promise<SimpleUserDto> {
    return this.userService.findOne({ email: req.user?.email as string }).then(async (profile) => {
      const editUser = await this.userService.updateOneById(profile.id, user)
      return new SimpleUserDto(editUser.toJSON())
    })
  }

  @Put(':id')
  @UseGuards(FirebaseGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async updateUserInfo(
    @Req() req: FirebaseUserRequest,
    @Param('id') id: number,
    @Body() user: EditableSimpleUserRequestDto,
  ): Promise<EditableSimpleUserDto> {
    if (!req.user) throw new UnauthorizedException()
    return this.userService.findOneById(id).then(async (profile) => {
      const editUser = await this.userService.updateOneById(profile.id, user)
      return new EditableSimpleUserDto({ ...editUser.toJSON(), editable: true })
    })
  }

  @HttpCode(200)
  @Post('validator')
  validator(@Body() user: UserDto): Promise<UserDto> {
    return Promise.resolve(user)
  }
}
