import { UserDto } from '@modules/user/user.dto'

describe('UsersDto', () => {
  it('should be defined', () => {
    expect(new UserDto()).toBeDefined()
  })
})
