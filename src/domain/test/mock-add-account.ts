import { AddAccount } from '@/domain/usecases/'
import faker from 'faker'

export const mockAddAccountParams = (): AddAccount.Params => {
  const password = faker.internet.password()
  return {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: password,
    passwordConfirmation: password
  }
}

export const mockAddAccountModel = (): AddAccount.Model => ({
  accessToken: 'mock-access-token',
  name: 'mock-name'
})
