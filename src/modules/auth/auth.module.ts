import { Module } from '@nestjs/common'
import { AuthService } from '@modules/auth/auth.service'
import { FirebaseStrategy } from '@modules/auth/firebase.strategy'

@Module({
  providers: [AuthService, FirebaseStrategy],
  exports: [AuthService],
})
export class AuthModule {}
