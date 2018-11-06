type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

interface PersonModel {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: Date
  createdDate: Date
}

type CreatePersonModel = Omit<PersonModel, 'createdDate'>

function pluck<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

const person: PersonModel = {
  id: '1',
  firstName: 'John',
  lastName: 'Smith',
  dateOfBirth: new Date(1970, 0, 1),
  createdDate: new Date(2018, 10, 5)
}

const id = pluck(person, 'id')

const typo = pluck(person, 'fristName')