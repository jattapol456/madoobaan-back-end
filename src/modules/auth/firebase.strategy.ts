import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import * as admin from 'firebase-admin'
import { Strategy } from 'passport-http-header-strategy'

import { AuthService } from '@modules/auth/auth.service'

@Injectable()
export class FirebaseStrategy extends PassportStrategy(Strategy, 'firebase') {
  constructor(private authService: AuthService) {
    super({
      header: 'Authorization',
    })
  }

  async validate(token?: string): Promise<admin.auth.DecodedIdToken | null> {
    return token ? await this.authService.validateToken(token) : null
  }
}
