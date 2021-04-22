import { Types } from 'mongoose'
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { CaslAbilityFactory } from '@modules/casl/casl-ability.factory'
import * as sgMail from '@sendgrid/mail'
import { emailTemplate } from 'src/constants/emailTemplate'

@Injectable()
export class HelperService {
  constructor(private caslAbilityService: CaslAbilityFactory) {}

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
