type Grow<N extends number, A extends Array<unknown> = []> = A['length'] extends N
  ? A
  : Grow<N, [...A, A['length']]>
declare function heavy<const N extends number>(
  n: N,
): { [K in keyof Grow<N>]: Grow<N>[K] extends number ? `v${Grow<N>[K]}` : never }
export const update = () => heavy(700)
export const view = () => heavy(650)
