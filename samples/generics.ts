type Nullable<T> = T | null
const aa: Nullable<string> = null // aa: string | null
const bb: Nullable<number> = null // bb: boolean | null
const cc: Nullable<SomeType> = null // cc: SomeType | null


class Component<TProps = {}, TState = {}> {
  constructor(private props: TProps, private state: TState) { 
  }
}

const comp = new Component({}, {}) // expected 2 arguments


function pluck<T, K extends keyof T>(obj: T, key: K) {
  return obj[key]
}

function getId<T extends { id: any }>(obj: T) {
  return obj.id
}

const p = getId({ id: 5, value: 3 }) // OK
const q = getId({ value: 3 }) // Error, T does not extend { id: any }