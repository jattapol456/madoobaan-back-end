import { BaseService } from '@modules/base/base.service'
import { CaslAbilityFactory } from '@modules/casl/casl-ability.factory'
import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { File, FileDocument } from '@schemas/file.schema'
import { Multipart } from 'fastify-multipart'
import { Model } from 'mongoose'
import { FileType } from 'src/constants/fileType'
import * as admin from 'firebase-admin'
import { UserService } from '@modules/user/user.service'
import { CompanyService } from '@modules/company/company.service'
import * as sharp from 'sharp'

@Injectable()
export class FileService extends BaseService<FileDocument> {
  constructor(
    @InjectModel(File.name) private fileModel: Model<FileDocument>,
    private userService: UserService,
    private companyService: CompanyService,
    private caslAbilityService: CaslAbilityFactory,
  ) {
    super(fileModel)
  }

  async createFile(file: Multipart, type: string, referenceId: number, name?: string): Promise<FileDocument> {
    switch (type) {
      case FileType.USER_PROFILE:
        return await this.fileModel
          .create({
            type: type,
            referenceId: referenceId,
            url: await this.uploadFile(file, FileType.USER_PROFILE, referenceId, 'original'),
            urlM: await this.uploadFile(file, FileType.USER_PROFILE, referenceId, 'm'),
            urlS: await this.uploadFile(file, FileType.USER_PROFILE, referenceId, 's'),
          })
          .then(async (result) => {
            await this.userService.updateOneById(referenceId, {
              imageProfileUrl: result.url,
              imageProfileUrlS: result.urlS,
              imageProfileUrlM: result.urlM,
            })
            return await result
          })
        break
      case FileType.COMPANY_PROFILE:
        return await this.fileModel
          .create({
            type: type,
            referenceId: referenceId,
            url: await this.uploadFile(file, FileType.COMPANY_PROFILE, referenceId, 'original'),
            urlM: await this.uploadFile(file, FileType.COMPANY_PROFILE, referenceId, 'm'),
            urlS: await this.uploadFile(file, FileType.COMPANY_PROFILE, referenceId, 's'),
          })
          .then(async (result) => {
            await this.companyService.updateOneById(referenceId, {
              imageProfileUrl: result.url,
              imageProfileUrlS: result.urlS,
              imageProfileUrlM: result.urlM,
            })
            return await result
          })
        break
      case FileType.USRE_PERSONAL_DOCUMENT:
        return await this.fileModel.create({
          type: type,
          referenceId: referenceId,
          name: name,
          url: await this.uploadFile(file, FileType.USRE_PERSONAL_DOCUMENT, referenceId, 'original'),
        })
        break
      default:
        throw new UnauthorizedException()
    }
  }

  async uploadFile(file: Multipart, type: string, referenceId: number, info?: string): Promise<string> {
    let path = ''
    switch (type) {
      case FileType.USER_PROFILE:
        path = 'Users' + '/' + referenceId + '/' + FileType.USER_PROFILE + '/' + type + '-' + info + '-' + file.filename
        break
      case FileType.COMPANY_PROFILE:
        path =
          'Companies' +
          '/' +
          referenceId +
          '/' +
          FileType.COMPANY_PROFILE +
          '/' +
          type +
          '-' +
          info +
          '-' +
          file.filename
        break
      case FileType.USRE_PERSONAL_DOCUMENT:
        path = 'Users' + '/' + referenceId + '/' + FileType.USRE_PERSONAL_DOCUMENT + '/' + file.filename
        break
    }
    return new Promise(async (resolve, reject) => {
      const fileUpload = admin
        .storage()
        .bucket()
        .file(await path)
      const blobStream = fileUpload.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      })

      blobStream.on('error', (err) => {
        reject(new InternalServerErrorException(err))
      })

      blobStream.on('finish', async () => {
        resolve(
          await (
            await fileUpload.getSignedUrl({
              action: 'read',
              expires: '10-25-2538',
            })
          )[0],
        )
      })
      switch (type) {
        case FileType.USER_PROFILE:
        case FileType.COMPANY_PROFILE:
          return blobStream.end(await this.reSizeFile(file, info))
          break
        case FileType.USRE_PERSONAL_DOCUMENT:
          return blobStream.end(await file.toBuffer())
          break
        default:
          throw new UnauthorizedException()
      }
    })
  }

  async reSizeFile(file: Multipart, size?: string): Promise<Buffer> {
    switch (size) {
      case 's':
        return await sharp(await file.toBuffer())
          .resize(100, 100)
          .toBuffer()
        break
      case 'm':
        return await sharp(await file.toBuffer())
          .resize(300, 300)
          .toBuffer()
        break
      default:
        return await file.toBuffer()
    }
  }

  async findByUserAndType(userId: number, type: FileType): Promise<FileDocument[]> {
    return await this.fileModel.find({
      referenceId: userId,
      type: type,
    })
  }
}
