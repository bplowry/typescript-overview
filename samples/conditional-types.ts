type DeepReadonly<T> =
  T extends (infer R)[] ? DeepReadonlyArray<R> :
  T extends Function ? T :
  T extends object ? DeepReadonlyObject<T> :
  T

interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {}

type DeepReadonlyObject<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>
}


interface ComplexType {
  one: string
  two: {
    a: number
    b: boolean
  }
  three: number[]
}

const immutable: DeepReadonly<ComplexType> = {
  one: 'one',
  two: {
    a: 0,
    b: true
  },
  three: [0, 1, 2]
}

immutable.one = '1'
immutable.two = { a: 1, b: false }
immutable.two.a = 4
immutable.two.b = false
immutable.three.push(3)
immutable.three[0] = 5


function someWeirdFunction<T>(input: T): T extends string ? () => void : number {
  return {} as any // TODO implementation for this strange, strange function
}

const a = someWeirdFunction('test') // a: () => void
const b = someWeirdFunction(5) // b: number
const c = someWeirdFunction({}) // c: number
