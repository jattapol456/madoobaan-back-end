import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import * as admin from 'firebase-admin'

@Injectable()
export class AuthService {
  async validateToken(token: string): Promise<admin.auth.DecodedIdToken | null> {
    const decodedIdToken = await admin
      .auth()
      .verifyIdToken(token.replace('Bearer ', ''))
      .catch((e) => {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: e?.message,
          },
          HttpStatus.BAD_REQUEST,
        )
      })

    return decodedIdToken ? Promise.resolve(decodedIdToken) : Promise.resolve(null)
  }
}
