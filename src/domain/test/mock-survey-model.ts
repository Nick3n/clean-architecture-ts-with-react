import { SurveyModel } from '../models'
import faker from 'faker'

export const mockSurveyModel = (): SurveyModel => (
  {
    id: faker.datatype.uuid(),
    question: faker.random.words(10),
    answers: [{
      answer: faker.random.words(4),
      image: faker.internet.url()
    }],
    didAnswer: faker.datatype.boolean(),
    date: faker.date.recent()
  }
)
