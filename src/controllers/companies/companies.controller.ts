import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'

import { CompanyService } from '@modules/company/company.service'
import { FirebaseGuard } from '@modules/auth/firebase.guard'
import {
  CompanyDto,
  CreateCompanyDto,
  EditableCompanyDto,
  PartialCompanyDto,
  SimpleCompanyDto,
} from '@modules/company/company.dto'
import { FirebaseUserRequest } from 'src/types'
import { UserService } from '@modules/user/user.service'
import { Action } from 'src/constants/action'
import { HelperService } from '@modules/helper/helper.service'
import { plainToClass } from 'class-transformer'
import { UserCompanyService } from '@modules/user-company/user-company.service'

@Controller('companies')
@UseGuards(FirebaseGuard)
export class CompaniesController {
  constructor(
    private companyService: CompanyService,
    private userService: UserService,
    private userCompanyService: UserCompanyService,
    private helperService: HelperService,
  ) {}

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async getCompanyById(@Req() req: FirebaseUserRequest, @Param('id') id: number): Promise<EditableCompanyDto> {
    let editable = false

    const user = await this.userService.findOne({ email: req.user?.email as string }).catch((e) => {
      if (e instanceof NotFoundException) return null
      throw e
    })
    const company = await this.companyService.findOneById(id)
    editable = !!user && (await this.helperService.can(user, company, Action.Update))

    return {
      ...plainToClass(CompanyDto, company.toObject()),
      editable,
    }
  }

  @Post()
  async createCompany(@Req() req: FirebaseUserRequest, @Body() company: CreateCompanyDto): Promise<SimpleCompanyDto> {
    return await this.userService
      .findOne({ email: req.user?.email as string })
      .then(async (user) => (await this.companyService.createCompany(company, user)).toJSON())
  }

  @Put(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async updateCompany(
    @Req() req: FirebaseUserRequest,
    @Param('id') id: number,
    @Body() edit: PartialCompanyDto,
  ): Promise<CompanyDto> {
    if (!req.user) throw new UnauthorizedException()
    const company = await this.companyService.findOne({ id })
    const reader = await this.userService.findOne({ email: req.user.email as string })
    if (!this.helperService.can(reader, company, Action.Update)) throw new UnauthorizedException()
    return await this.companyService
      .updateCompany(id, edit)
      .then((company) => plainToClass(CompanyDto, company.toObject()))
  }

  @Delete(':id')
  async deleteCompany(@Req() req: FirebaseUserRequest, @Param('id') id: number): Promise<void> {
    const company = await this.companyService.findOne({ id })
    const reader = await this.userService.findOne({ email: req.user?.email as string })
    if (!this.helperService.can(reader, company, Action.Delete)) throw new UnauthorizedException()
    await this.companyService.delete(company.id)
    return Promise.resolve()
  }
}
