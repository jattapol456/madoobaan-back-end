import { CompanyService } from '@modules/company/company.service'
import { FileService } from '@modules/file/file.service'
import { HelperService } from '@modules/helper/helper.service'
import { UserService } from '@modules/user/user.service'
import {
  BadRequestException,
  ClassSerializerInterceptor,
  Controller,
  InternalServerErrorException,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FastifyRequest } from 'fastify'

import { FirebaseUserRequest } from 'src/types'
import { FirebaseGuard } from '@modules/auth/firebase.guard'
import { FileType } from 'src/constants/fileType'
import { FileDto, SimpleFileDto } from '@modules/file/file.dto'
import { Action } from 'src/constants/action'
import { Multipart } from 'fastify-multipart'

@Controller('files')
@UseGuards(FirebaseGuard)
export class FilesController {
  constructor(
    private fileService: FileService,
    private companyService: CompanyService,
    private userService: UserService,
    private helperService: HelperService,
  ) {}

  @Post('user')
  @UseInterceptors(ClassSerializerInterceptor)
  async uploadUserProfile(@Req() req: FirebaseUserRequest, @Req() files: FastifyRequest): Promise<SimpleFileDto> {
    const file = (await (files.body as any).files) as Multipart
    const reader = await this.userService.findOne({ email: req.user?.email as string })
    const result = await this.fileService.createFile(file, FileType.USER_PROFILE, reader.id)
    return new SimpleFileDto(result.toObject())
  }

  @Post('company')
  @UseInterceptors(ClassSerializerInterceptor)
  async uploadCompanyProfile(@Req() req: FirebaseUserRequest, @Req() files: FastifyRequest): Promise<SimpleFileDto> {
    const file = (await (files.body as any).files) as Multipart
    const reader = await this.userService.findOne({ email: req.user?.email as string })
    const company = await this.companyService.findOne({ id: (files.body as any).companyId.value as number })
    if (!this.helperService.can(reader, company, Action.Create)) throw new UnauthorizedException()
    const result = await this.fileService.createFile(file, FileType.COMPANY_PROFILE, company.id)
    return new SimpleFileDto(result.toObject())
  }

  @Post('user/document')
  @UseInterceptors(ClassSerializerInterceptor)
  async uploadDocumentFile(@Req() req: FirebaseUserRequest, @Req() files: FastifyRequest): Promise<SimpleFileDto> {
    const file = (await (files.body as any).files) as Multipart
    const name = (await (files.body as any).name.value) as string
    const reader = await this.userService.findOne({ email: req.user?.email as string })
    return new SimpleFileDto(
      (await this.fileService.createFile(file, FileType.USRE_PERSONAL_DOCUMENT, reader.id, name)).toObject(),
    )
  }
}
