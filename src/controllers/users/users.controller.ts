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
import { UserCompanyService } from '@modules/user-company/user-company.service'
import { SimpleUserCompanyDto } from '@modules/user-company/user-company.dto'
import { Types } from 'mongoose'
import { CompanyDto } from '@modules/company/company.dto'
import { plainToClass } from 'class-transformer'
import { CompanyDocument } from '@schemas/company.schema'
import { CompanyService } from '@modules/company/company.service'
import { DocumentFileDto } from '@modules/file/file.dto'
import { FileService } from '@modules/file/file.service'
import { FileType } from 'src/constants/fileType'

@Controller('users')
@UseGuards(FirebaseGuard)
export class UsersController {
  constructor(
    private fileService: FileService,
    private userService: UserService,
    private userCompanyService: UserCompanyService,
    private companyService: CompanyService,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

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

  @Get('me/companies')
  @UseInterceptors(ClassSerializerInterceptor)
  async getMeCompanies(@Req() req: FirebaseUserRequest): Promise<SimpleUserCompanyDto[]> {
    if (!req.user) throw new UnauthorizedException()

    return await this.userService
      .findOne({ email: req.user.email as string })
      .then((profile) => this.userCompanyService.findAllByUserId(profile._id as Types.ObjectId))
      .then((userCompanies) =>
        userCompanies.map((each) =>
          plainToClass(SimpleUserCompanyDto, { ...(each.company as CompanyDocument).toObject(), role: each.role }),
        ),
      )
  }

  @Get('me/companies/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async getMeCompanyById(@Req() req: FirebaseUserRequest, @Param('id') id: number) {
    if (!req.user) throw new UnauthorizedException()

    const user = await this.userService.findOne({ email: req.user.email as string })
    const company = await this.companyService.findOne({ id: id })

    const userCompany = await this.userCompanyService.findOneBy({
      user: user._id as Types.ObjectId,
      company: company._id as Types.ObjectId,
    })

    if (!userCompany) throw new UnauthorizedException()

    return plainToClass(SimpleUserCompanyDto, {
      ...(userCompany.company as CompanyDocument).toObject(),
      role: userCompany.role,
    })
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

  @Get('role')
  @UseInterceptors(ClassSerializerInterceptor)
  async gerUserRole(@Req() req: FirebaseUserRequest): Promise<SimpleUserCompanyDto[]> {
    return await this.userService
      .findOne({ email: req.user?.email as string })
      .then((profile) => this.userCompanyService.findAllByUserId(profile._id as Types.ObjectId))
      .then((userCompanies) =>
        userCompanies.map((each) => ({
          ...plainToClass(SimpleUserCompanyDto, each.toObject()),
          user: each.user as UserDto,
          company: each.company as CompanyDto,
        })),
      )
  }

  @Get('files')
  @UseInterceptors(ClassSerializerInterceptor)
  async gerAllUserFile(@Req() req: FirebaseUserRequest): Promise<DocumentFileDto[]> {
    if (!req.user) throw new UnauthorizedException()
    const user = await this.userService.findOne({ email: req.user.email as string })
    return await (await this.fileService.findByUserAndType(user.id, FileType.USRE_PERSONAL_DOCUMENT)).map((file) =>
      plainToClass(DocumentFileDto, file.toObject()),
    )
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
