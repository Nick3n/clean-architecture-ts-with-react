import { HttpPostClientSpy } from '@/data/test'
import { RemoteAddAccount } from './remote-add-account'
import faker from 'faker/locale/en_BORK'
import { mockAddAccountParams, mockAddAccountModel } from '@/domain/test'
import { HttpStatusCode } from '@/data/protocols/http'
import { EmailInUseError, UnexpectedError } from '@/domain/errors'

type SutTypes = {
  sut: RemoteAddAccount
  httpPostClientSpy: HttpPostClientSpy<RemoteAddAccount.Params, RemoteAddAccount.Model>
}

const makeSut = (url: string = faker.internet.url()): SutTypes => {
  const httpPostClientSpy = new HttpPostClientSpy<RemoteAddAccount.Params, RemoteAddAccount.Model>()
  const sut = new RemoteAddAccount(url, httpPostClientSpy)
  return {
    sut,
    httpPostClientSpy
  }
}

describe('RemoteAddAccount', () => {
  test('Should call HttpClient with correct URL', async () => {
    const url = faker.internet.url()
    const { sut, httpPostClientSpy } = makeSut(url)
    await sut.add(mockAddAccountParams())
    expect(httpPostClientSpy.url).toBe(url)
  })

  test('Should call HttpPostClient with correct body', async () => {
    const { sut, httpPostClientSpy } = makeSut()
    const addAccountParams = mockAddAccountParams()
    await sut.add(addAccountParams)
    expect(httpPostClientSpy.body).toEqual(addAccountParams)
  })

  test('Should throw EmailInUseError if HttpPostClient reuturns 403', async () => {
    const { sut, httpPostClientSpy } = makeSut()
    httpPostClientSpy.response.statusCode = HttpStatusCode.forbidden
    const promise = sut.add(mockAddAccountParams())
    await expect(promise).rejects.toThrowError(new EmailInUseError())
  })

  test('Should throw UnexpectedError if HttpPostClient returns 400', async () => {
    const { sut, httpPostClientSpy } = makeSut()
    httpPostClientSpy.response.statusCode = HttpStatusCode.badRequest
    const promise = sut.add(mockAddAccountParams())
    await expect(promise).rejects.toThrowError(new UnexpectedError())
  })

  test('Should throw UnexpectedError if HttpPostClient returns 500', async () => {
    const { sut, httpPostClientSpy } = makeSut()
    httpPostClientSpy.response.statusCode = HttpStatusCode.serverError
    const promise = sut.add(mockAddAccountParams())
    await expect(promise).rejects.toThrowError(new UnexpectedError())
  })

  test('Should throw UnexpectedError if HttpPostClient returns 404', async () => {
    const { sut, httpPostClientSpy } = makeSut()
    httpPostClientSpy.response.statusCode = HttpStatusCode.notFound
    const promise = sut.add(mockAddAccountParams())
    await expect(promise).rejects.toThrowError(new UnexpectedError())
  })

  test('Should return an AccountModel if HttpPostClient returns 200', async () => {
    const { sut, httpPostClientSpy } = makeSut()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: mockAddAccountModel()
    }
    const account = await sut.add(mockAddAccountParams())
    expect(account).toEqual(mockAddAccountModel())
  })
})
