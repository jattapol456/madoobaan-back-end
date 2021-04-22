import { User } from '@schemas/user.schema'

describe('Users', () => {
  it('should be defined', () => {
    expect(new User()).toBeDefined()
  })
})
