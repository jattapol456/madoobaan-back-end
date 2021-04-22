import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class FirebaseGuard extends AuthGuard('firebase') {
  handleRequest(err: any, user: any, info: any, context: any) {
    return user
  }
}
