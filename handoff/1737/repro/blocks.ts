import { update, view } from './heavy'
import * as L from './lib'
export const Eager = L.assembleEager(L.Model, { update, view })
export const ThunkUnconstrained = L.assembleThunkUnconstrained(L.Model, () => ({ update, view }))
export const ThunkConstrained = L.assembleThunkConstrained(L.Model, () => ({ update, view }))
export const ThunkContextual = L.assembleThunkContextual(L.Model, () => ({ update, view }))
export const NoBlock = { Model: L.Model }
