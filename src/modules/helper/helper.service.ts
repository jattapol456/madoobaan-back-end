import { Types } from 'mongoose'
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { UserCompanyService } from '@modules/user-company/user-company.service'
import { CompanyDocument } from '@schemas/company.schema'
import { UserDocument } from '@schemas/user.schema'
import { Action } from 'src/constants/action'
import { CaslAbilityFactory } from '@modules/casl/casl-ability.factory'
import { UserCompany } from '@schemas/user-company.schema'
import * as sgMail from '@sendgrid/mail'
import { emailTemplate } from 'src/constants/emailTemplate'

@Injectable()
export class HelperService {
  constructor(private userCompanyService: UserCompanyService, private caslAbilityService: CaslAbilityFactory) {}

  async can(user: UserDocument, company: CompanyDocument, action: Action): Promise<boolean> {
    const userCompany = await this.userCompanyService
      .findOne({ company: company._id as Types.ObjectId, user: user._id })
      .catch((e) => {
        if (e instanceof NotFoundException) throw new UnauthorizedException()
        else throw e
      })

    const ability = this.caslAbilityService.createForUser(user)
    return ability.can(action, new UserCompany(userCompany.toObject()))
  }

  async sentEmail(to: string[], type: string, info?: any): Promise<boolean> {
    let msg = Object()
    switch (type) {
      case emailTemplate.ApplyJOb:
        msg = {
          to: to,
          from: 'everyday@onedee.ai',
          templateId: emailTemplate.ApplyJOb,
          dynamicTemplateData: {
            subject: '',
            jobname: info as string,
          },
        }
        break
    }
    sgMail.setApiKey(process.env.SENDGRID_API_KEY!)
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent to => ' + to)
      })
      .catch((error) => {
        console.error(error)
        return false
      })
    return true
  }
}
