import { InvalidFieldError } from '@/validation/errors/invalid-field-error'
import { FieldValidation } from '@/validation/protocols/field-validation'

export class CompareFieldsValidation implements FieldValidation {
  constructor (readonly name: string, private readonly valueToCompare: string) {}

  validate (value: string): Error {
    return new InvalidFieldError()
  }
}