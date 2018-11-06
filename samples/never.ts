enum Animals { Dog, Cat, Chicken }

function assertNever(n: never): never {
  throw n
}

function doTheThing(animal: Animals) {
  switch (animal) {
    case Animals.Dog:
      return 'woof'
    case Animals.Cat:
      return 'meow'
    // case Animals.Chicken:
    //   return 'cluck'
    default:
      return assertNever(animal)
  }
}