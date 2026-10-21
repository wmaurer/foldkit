export type Equal<Left, Right> =
  (<V>() => V extends Left ? 1 : 2) extends <V>() => V extends Right ? 1 : 2
    ? (<V>() => V extends Right ? 1 : 2) extends <V>() => V extends Left ? 1 : 2 ? true : false
    : false
export type Assert<T extends true> = T
export type MembersEqual<Left, Right> = Equal<
  { [K in keyof Left]-?: Equal<Left[K], K extends keyof Right ? Right[K] : never> }[keyof Left],
  true
>
