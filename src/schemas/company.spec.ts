import { Company } from './company.schema'

describe('Company', () => {
  it('should be defined', () => {
    expect(new Company()).toBeDefined()
  })
})
