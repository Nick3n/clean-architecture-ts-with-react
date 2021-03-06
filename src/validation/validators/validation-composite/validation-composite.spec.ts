import { FieldValidationSpy } from '@/validation/test/'
import { ValidationComposite } from './validation-composite'
import faker from 'faker'

type SutTypes = {
  sut: ValidationComposite
  fieldValidationsSpy: FieldValidationSpy[]
}

const makeSut = (fieldName: string): SutTypes => {
  const fieldValidationsSpy = [new FieldValidationSpy(fieldName), new FieldValidationSpy(fieldName)]
  const sut = ValidationComposite.build(fieldValidationsSpy)
  return {
    sut,
    fieldValidationsSpy
  }
}

describe('ValidationComposite', () => {
  test('Should return error if any validation fails', () => {
    const fieldName = faker.database.column()
    const fieldValue = faker.random.word()
    const { sut, fieldValidationsSpy } = makeSut(fieldName)
    const errorMessage = faker.random.words()
    fieldValidationsSpy[0].error = new Error(errorMessage)
    const error = sut.validate(fieldName, { [fieldName]: fieldValue })
    expect(error).toBe(errorMessage)
  })

  test('Should return first error message if any validation fails', () => {
    const fieldName = faker.database.column()
    const fieldValue = faker.random.word()
    const { sut, fieldValidationsSpy } = makeSut(fieldName)
    const firstErrorMessage = faker.random.words()
    const secondErrorMessage = faker.random.words()
    fieldValidationsSpy[0].error = new Error(firstErrorMessage)
    fieldValidationsSpy[1].error = new Error(secondErrorMessage)
    const error = sut.validate(fieldName, { [fieldName]: fieldValue })
    expect(error).toBe(firstErrorMessage)
  })

  test('Should return falsy if calls a field that not contain errors', () => {
    const fieldName = faker.database.column()
    const { sut } = makeSut(fieldName)
    const error = sut.validate(fieldName, { [fieldName]: faker.random.word() })
    expect(error).toBeFalsy()
  })
})
