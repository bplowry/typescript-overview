interface BaseType { id: string, value: any }
interface SubType { id: string }
interface SomeOtherType { key: string }

const someObj: BaseType = { id: '1', value: 1 }
const first = someObj as SubType // TypeScript is OK with this
const second = someObj as SomeOtherType // error, neither type sufficiently overlaps with the other
const third = someObj as any as SomeOtherType // OK, since you double casted to `any`, then to `SomeOtherType`
const fourth = someObj as unknown as SomeOtherType // you can also use `unknown`