import { update, view } from './heavy'
import * as L from './lib'
export const Good = L.assembleThunkUnconstrained(L.Model, () => L.implementation({ update, view }))
export const Bad = L.assembleThunkUnconstrained(L.Model, () => L.implementation({ update, view: 5 }))
