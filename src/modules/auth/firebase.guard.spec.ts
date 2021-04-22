import { FirebaseGuard } from '@modules/auth/firebase.guard'

describe('FirebaseGuard', () => {
  it('should be defined', () => {
    expect(new FirebaseGuard()).toBeDefined()
  })
})
