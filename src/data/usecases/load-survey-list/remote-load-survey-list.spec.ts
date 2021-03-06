import { HttpStatusCode } from '@/data/protocols/http'
import { HttpGetClientSpy } from '@/data/test'
import { UnexpectedError } from '@/domain/errors'
import { mockSurveyModelList } from '@/domain/test'
import { RemoteLoadSurveyList } from './remote-load-survey-list'
import faker from 'faker'

type SutTypes = {
  sut: RemoteLoadSurveyList
  httpGetClientSpy: HttpGetClientSpy<RemoteLoadSurveyList.Model>
}

const makeSut = (url: string = faker.internet.url()): SutTypes => {
  const httpGetClientSpy = new HttpGetClientSpy<RemoteLoadSurveyList.Model>()
  const sut = new RemoteLoadSurveyList(url, httpGetClientSpy)
  return {
    sut,
    httpGetClientSpy
  }
}

describe('RemoteLoadSurveyList', () => {
  test('Should call HttpGetClient with correct url', async () => {
    const url = faker.internet.url()
    const { sut, httpGetClientSpy } = makeSut(url)
    await sut.loadAll()
    expect(httpGetClientSpy.url).toBe(url)
  })

  test('Should throw UnexpectedError if HttpGetClient returns 403', async () => {
    const { sut, httpGetClientSpy } = makeSut()
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.forbidden
    }
    const error = sut.loadAll()
    await expect(error).rejects.toThrowError(new UnexpectedError())
  })

  test('Should throw UnexpectedError if HttpGetClient returns 404', async () => {
    const { sut, httpGetClientSpy } = makeSut()
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    }
    const error = sut.loadAll()
    await expect(error).rejects.toThrowError(new UnexpectedError())
  })

  test('Should throw UnexpectedError if HttpGetClient returns 500', async () => {
    const { sut, httpGetClientSpy } = makeSut()
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    }
    const error = sut.loadAll()
    await expect(error).rejects.toThrowError(new UnexpectedError())
  })

  test('Should return a list of SurveyModels if httpGetClient returns 200', async () => {
    const { sut, httpGetClientSpy } = makeSut()
    const httpResult = mockSurveyModelList()
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResult
    }
    const surveyList = await sut.loadAll()
    expect(surveyList).toEqual(httpResult)
  })

  test('Should return an empty list of SurveyModels if httpGetClient returns 204', async () => {
    const { sut, httpGetClientSpy } = makeSut()
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.noContent
    }
    const surveyList = await sut.loadAll()
    expect(surveyList).toEqual([])
  })
})
