# TypeScript

Lets you add optional type annotations to your code to describe your intent, and will tell you when you do something outside of what you've described.

The whole point is to find bugs!

Benefits:

- better editing experience -- intellisense, etc
- shows you errors as you write, not when you run the code
- fewer bugs in production
- early access to new JavaScript features

Drawbacks:

- can result in a lot of errors if you add to an existing codebase
- more steps in your build system

***

## Type system

### Structural vs nominal typing

TypeScript uses a structural typing system, where (generally) a type is considered compatible if all of the properties on one are present on the other, and the types of those properties are compatible as well.

Compatibility comes as one of two forms: sub-type, or assignable. Assignability does not necessarily work in both directions.

```ts
class Order {
  id: string = ''
  date: Date = new Date()
}

class Payment {
  id: string = ''
  date: Date = new Date()
  amount: number
}

function getPaymentDate(payment: Payment): Date {
  return payment.date
}

const payment = new Payment()
const order = new Order()

getPaymentDate(payment)
getPaymentDate(order) // OK, all the properties of a Payment are present, and their types are compatible
```

In a nominal type system, the above would have an error, as Order and Payment aren't the same.

### Type inference

Type annotations are optional because the TypeScript compiler can generally guess (infer) the type of a variable.

```ts
let amount = 36 // TypeScript infers `amount` as type number

let isComplete = x.status === 'complete' // TypeScript infers `isComplete` as type boolean
```

Sometimes TypeScript can't infer the type, so it was use the `any` type, which basically means it could be anything.

See also [compilerOptions > noImplicitAny](#no-implicit-any)

### Type annotations

Adding type annotations to variables, arguments, or properties can assist the TypeScript compiler in ensuring you are using it consistently.

Adding type annotations means you could have more type errors even when the implementation is still valid, e.g. addition of numbers or concatenation of strings, but makes your intention clear

```ts
function add(first, second) {
  return first + second
}

add(1, 2) // 3
add('twenty', 'two') // 'twentytwo'. it's still valid to add strings, but is that your intention?
```

### Primitive types

#### `boolean`

`true` or `false`

#### `number`

Numbers, both integers and decimals* (floating point), including `NaN`, `Infinity`, `-Infinity`, `0`, and `-0`

#### `string`

Sequences of text, including the empty string `''`, or single characters.

Strings behave a little like arrays, since you can index into them, `slice`, etc.

#### `Array`

Groups or lists of references. In JavaScript/TypeScript, each element in an array can have a different type.

#### `object`

Objects with properties. In JavaScript, a `typeof` check will also return `'object'` for `null`, arrays

#### `Function`

Functions that take arguments and do or return things.

#### `Symbol`

Sort of like a unique identifier

### Special types

#### `undefined` 🐲

The value `undefined`

#### `null` 🐲

The value `null`

#### `any` 🐲

Essentially a union of all other types. A variable that is annotated as `any` is assignable to any other variable, and any variable/value is assignable to `any`

Most issues with `any` come from the fact that it is assignable to any other type. That means that you (and the TypeScript compiler) might _think_ you're dealing with a number, but it's actually a string. You can get around this in a few ways: using the `unknown` type, or using a union of all the things you might expect, e.g. `boolean` | `number` | `string` | `object` | `Function` | `Symbol` | `null` | `undefined`. In both cases, you get the flexibility to assign anything _to_ them, but without the risk of assign anything _from_ them, reducing the number of bugs.

#### `unknown`

Typesafe `any`. All values/variables are assignable to `unknown`, but a variable annotated as `unknown` is not assignable to any other variable.

The `unknown` type forces you to use type narrowing or type assertion before being able to use it in any meaningful way.

Type narrowing is _proving_ that it is what you say it is.
Type assertion is _telling_ that it is what you say it is.

The unknown type is good to use in your own type narrowing functions, or when dealing with external libraries.

#### `void`

Can only be used as a return type. It is used to say that a function returns nothing.

This is not exactly true in TypeScript, because all functions will return something, even if that is `undefined`, but it's a good hint that the function has side-effects, rather than being a calculation.

#### `never`

The `never` type is used to represent a function that never returns, for example an infinite loop, or something that always throws an exception. We can get a few tricks with this, though. For example, exhaustive checking:

```ts
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
    default:
      return assertNever(animal) // argument of type `Animals.Chicken` is not assignable to parameter of type `never`
  }
}
```

### Generics

Sometimes you have a type where you want to specify some general behaviour, for example, the type of elements in an array. TypeScript has a construct for this called generics.

```ts
type Nullable<T> = T | null
const a: Nullable<string> = null // a: string | null
const b: Nullable<number> = null // b: boolean | null
const c: Nullable<SomeType> = null // c: SomeType | null
```

#### Default type arguments

You can specify default types for a generic type (although TypeScript will generally infer it, anyway). Doing so means you can leave off optional type arguments

```ts
class Component<TProps = {}, TState = {}> {
  constructor(private props: TProps, private state: TState) {
  }
}
```

#### Type argument constraints

Constraining type arguments is useful, especially when using `keyof`

```ts
function pluck<T, K extends keyof T>(obj: T, key: K) {
  return obj[key]
}

function getId<T extends { id: any }>(obj: T) {
  return obj.id
}

const p = getId({ id: 5, value: 3 }) // OK
const q = getId({ value: 3 }) // Error, T does not extend { id: any }
```

### Union types

Union types let you get back some of the dynamic typing from JavaScript, without the risk of `any`

By speficying that something might be a `string | number | object`, the compiler can force you to figure out _which_ it is before working with it. This results in fewer bugs.

You can also create union types of string literals, which is an alternative representation of an `enum`.

```ts
type Protocol = 'http' | 'https'
enum ProtocolEnum { http, https }

const a = ProtocolEnum.http
const b: Protocol = 'http' // still get intellisense and type checking in `if` statements, etc.
```

### Intersection types

Intersection types allow you to extend other types, as well as a few tricks to create nominal types.

```ts
type Combined = { oneProp: any } & { twoProp: any } // { oneProp: any, twoProp: any }
```

### `class` vs `type` vs `interface`

Classes, types and interfaces are all ways of identifying the shape of an object, and they can be used interchangeably, for the most part.

- (?) Classes exist at run-time
- (+) Interface declarations can be merged
- (+) Types can have unions

If you're creating a library, anything exported should be an `interface` as they can be extended by consumers

### `enum` vs string literal

Rather than a "traditional" `enum` with integer values, you can use a string enum, or even a union of literal strings.

```ts
type Protocol = 'http' | 'https'

enum ProtocolEnum {
  http, // 0
  https // 1
}

enum ProtocolStringEnum {
  http = 'http',
  https = 'https'
}
```

#### Gotchas

```ts
enum Colors { Red, Green, Blue }

const cssColors = {
  [Colors.Red]: '#ff0000',
  [Colors.Green]: '#00ff00',
  [Colors.Blue]: '#0000ff'
}

function getCssColorOrDefault(color?: Colors): string {
  return !!color ? cssColors[color] : 'currentColor'
}

const red = getCssColorOrDefault(Colors.Red) // ???
```

### Function overloading

In some languages you can define two functions with the same name at the same scope, but JavaScript is not one of those. However, TypeScript lets you do that, though there are some things you need to keep in mind.

- stricter overloads should appear first
- the final overload (which won't be exposed to consumers) must handle all cases

```ts
function padding(padding: string): string
function padding(allSides: number): string
function padding(vertical: number, horizontal: number): string
function padding(top: number, horizontal: number, bottom: number): string
function padding(top: number, right: number, bottom: number, left: number): string
function padding(first: string | number, second?: number, third?: number, fourth?: number): string {
  // implementation
}
```

### Mapped types

Take one type and map it to another. You can also modify access modifiers like `?` to make it optional, or `-readonly` to remove a `readonly` modifier.

```ts
type Partial<T> = { [P in keyof T]?: T[P] }
type Required<T> = { [P in keyof T]-?: T[P] }

type Readonly<T> = { readonly [P in keyof T]: T[P] }
type Mutable<T> = { -readonly [P in keyof T]: T[P] }

type Pick<T, K extends keyof T> = { [P in K]: T[K] }
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

type Record<K extends keyof any, T> = { [P in K]: T }
```

#### `keyof T`

`keyof T` returns a union type of all keys in `T`. This allows typesafe access by property names,

```ts
function pluck<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}
```

### Conditional types

Conditional types let you filter out types by returning the `never` type, or otherwise, for example a function that return different types based on input

```ts
type NonNullable<T> = T extends null | undefined ? never : T;


function someWeirdFunction<T>(input: T): T extends string ? () => void : number {
  return {} as any // TODO implementation for this strange, strange function
}

const a = someWeirdFunction('test') // a: () => void
const b = someWeirdFunction(5) // b: number
const c = someWeirdFunction({}) // c: number
```

They can be useful to create deep or recursive type maps, for example extending a `Readonly<T>` or `Partial<T>` to nested types

```ts
type DeepReadonly<T> =
  T extends (infer R)[] ? DeepReadonlyArray<R> :
  T extends Function ? T :
  T extends object ? DeepReadonlyObject<T> :
  T

interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {}

type DeepReadonlyObject<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>
}
```

### Type narrowing

When you have union types, or other flexible types like `any` and `unknown`, you can use a TypeScript feature called type narrowing to get typesafe access to properties and methods of the variable.

#### Control flow analysis

TypeScript will automatically narrow based on your code, for example given a variable that could be null, once you've done a falsy check, TypeScript knows that from that point on, it's not null, so you won't get "object is possibly null" errors. Note, however, that if you don't `return`, `break`, `continue`, `throw`, etc. on those blocks, this won't happen. Essentially the compiler performs control flow analysis to figure out what the type of a variable is at any given point.

```ts
function stringify(input: string | number): string {
  if (typeof input === 'string') {
    // TypeScript knows it's a string

    return x
  }

  // now TypeScript knows it's _not_ a string
  input // number
}

function stringifyNoReturn(input: string | number): string {
  if (typeof input === 'string') {
    // TypeScript knows it's a string

    // return x
  }

  // without the return, it could still be a string
  input // string | number
}
```

#### DIY narrowing functions

In the example above, we used a `typeof` check to narrow to a string, but you can also implement your own type narrowing functions for user-defined types, by returning `x is Foo`

```ts
interface Order {
  id: string
  total: number
}

function isOrder(obj: any): obj is Order {
  return !!obj && typeof obj.id === 'string' && typeof obj.total === 'number'
}

function getTotal(obj: any): number {
  if (isOrder(obj)) {
    return obj.total
  }

  return 0
}
```

#### Discriminated unions

When you have related types in a union, you can add a property to help you discriminate between different types, for example a "kind" property. When you check based on the discriminator, TypeScript can determine the actual type you're dealing with

```ts
type Shape = Circle | Rectangle | Triangle

interface Circle {
  kind: 'circle'
  radius: number
}

interface Rectangle {
  kind: 'rectangle'
  width: number
  height: number
}

interface Triangle {
  kind: 'triangle'
  a: number
  b: number
  c: number
}

function getPerimeter(shape: Shape): number {
  switch (shape.kind) {
    case 'circle': return 2 * Math.PI * shape.radius
    case 'rectangle': return 2 * (shape.width + shape.height)
    case 'triangle': return (shape.a + shape.b + shape.c)
    default: return assertNever(shape)
  }
}
```

### Type widening 🐲

When you use a literal type, it's pretty easy for that to be widened, which means you may not get auto-completion again.

```ts
enum Tastes {
  Bitterness,
  Sweetness,
  Sourness,
  Saltiness,
  Umami,
}

const umami = Tastes.Umami // umami: Tastes.Umami
let taste = umami // taste: Tastes


const http = 'http' // http: 'http'
let protocol = http // protocol: string
if (protocol === 'ftp') { // OK, since 'ftp' is a string
  ...
}

const https: 'https' = 'https' // https: 'https'
let protocol2 = https // protocol2: 'https'
if (protocol2 === 'ftp') { // Error, condition will always return 'false' since the types '"https"' and '"ftp"' have no overlap.
  ...
}
```

### Type assertions 🐲

If the compiler can't figure out that something is compatible, you can use a type assertion to tell TypeScript that you are right. This comes with a risk (that you've lied to the compiler), but can be useful.

If you need to, you can double cast, but you're on your own at that point, as you've opened yourself up to mistakes

```ts
interface BaseType { id: string, value: any }
interface SubType { id: string }
interface SomeOtherType { key: string }

const someObj: BaseType = { id: '1', value: 1 }
const first = someObj as SubType // TypeScript is OK with this
const second = someObj as SomeOtherType // error, neither type sufficiently overlaps with the other
const third = someObj as any as SomeOtherType // OK, since you double casted to `any`, then to `SomeOtherType`
const fourth = someObj as unknown as SomeOtherType // you can also use `unknown`
```

***

## Ambient declarations

With `noImplicitAny` you will get errors when importing modules without type definitions. This is unfortunate, but the benefits far outweigh the drawbacks.

### `@types/<lib>`

There's a massive community-owned repository of types called [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped/)

### Creating declarations for external libraries

If you import a library and it doesn't ship with types, or have something in `@types/<X>`, you can create your own declaration file `*.d.ts` and include it in your `tsconfig.json` ("types", or "typeRoots"). Alternatively, an `index.d.ts` at the same level as your `package.json` will be picked up automatically.

#### Handy trick

```ts
interface SomeType {
  // still get intellisense and type-checking for specified properties
  knownProperty: string
  anotherProperty: boolean

  // allow other properties to be used
  [key: string]: any
}
```

***

## Compiler options

The TypeScript compiler is configurable to suit your needs. You can find your compiler options in `tsconfig.json`. If you don't have a `tsconfig.json`, then these options may be specified on the command line when running `tsc` (the TypeScript compiler), or you will be given some defaults.

Note: the defaults when you _don't_ have a `tsconfig.json` are different to the defaults when you run `tsc --init` to _create_ your `tsconfig.json` file

### <span id="no-implicit-any" /> `noImplicitAny`

The `any` type is the most flexible type in TypeScript, but it comes at a cost; you get no help from the compiler.

The `noImplicitAny` compiler option can help address this problem. Whenever the compiler infers an `any` type, it forces you annotate the variable/property/argument with the expected type.

It's perfectly valid for you to use `any`, you just need to be explicit about it.

### <span id="strict-null-checks" /> `strictNullChecks`

By default, `null` and `undefined` are valid values of every other type in TypeScript, which means it's perfectly valid to define a variable like so:

```ts
let name: string = null
const upperCase = name.toUpperCase() // compiles OK, but will throw an error at run-time
```

This is a common cause of bugs, so TypeScript gives you an option to remove `null` and `undefined` from other types. You can still use it if you want to by making a few changes

```ts
let age: number = null // Error, type `null` is not assignable to type `number`

let name: string | null = null
const upperCase = name.toUpperCase() // Error, `name` is possibly null
```

### `strict`

If you can, use `strict` mode, rather than specifying each of the strict options individually. This way you will get any new additions to strict mode

***

## What's new in TypeScript

### 2.7

- Fixed length tuples -- prevents otherwise compatible types from being considered the same

### 2.8

- Conditional types
- `--emitDeclarationOnly` -- useful for library authors using Babel

### 2.9

- `import` types -- allows for use in non-module files

### 3.0

- `unknown` -- typesafe `any`
- tuples, tuples, tuples -- spread, rest, optional, generics

### 3.1

- mapped types on tuples
- simpler typing for properties on functions
- `typesVersions` -- useful for library/declaration file authors

***

## Links

- [Tech Ladder IO](http://www.techladder.io/?tech=typescript)
- [Advanced types](https://www.typescriptlang.org/docs/handbook/advanced-types.html)
- [Compiler options](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
- [TypeScript design goals](https://github.com/Microsoft/TypeScript/wiki/TypeScript-Design-Goals)
- [TypeScript roadmap](https://github.com/Microsoft/TypeScript/wiki/Roadmap)
- [Type compatibility](https://github.com/Microsoft/TypeScript-Handbook/blob/master/pages/Type%20Compatibility.md)
- [TypeScript bugs that aren't bugs](https://github.com/Microsoft/TypeScript/wiki/FAQ#common-bugs-that-arent-bugs)
