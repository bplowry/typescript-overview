interface SomeType {
  // get intellisense and type checking for known properties
  knownProperty: string
  anotherProperty: boolean

  // allow other properties to be used
  [key: string]: any
}

const some: SomeType = {
  knownProperty: '',
  anotherProperty: false,
  anythingElse: ['look!', 'no errors'],
}