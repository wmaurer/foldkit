export type Model = { readonly count: number }
export const Model: Model = { count: 0 }
type Impl = { readonly update: () => unknown; readonly view: () => unknown }

export declare function assembleEager<M, I extends Impl>(
  model: M,
  impl: I,
): { readonly Model: M; readonly impl: I }

export declare function assembleThunkUnconstrained<M, F>(
  model: M,
  make: F,
): {
  readonly Model: M
  readonly impl: F extends () => infer I ? I : never
}

export declare function assembleThunkConstrained<M, F extends () => Impl>(
  model: M,
  make: F,
): { readonly Model: M; readonly impl: ReturnType<F> }

export declare function assembleThunkContextual<M>(
  model: M,
  make: () => Impl,
): { readonly Model: M; readonly impl: Impl }
export declare function implementation<I extends Impl>(impl: I): I
