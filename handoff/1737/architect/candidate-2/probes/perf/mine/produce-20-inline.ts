import { Schema } from 'effect'
import * as Block from 'foldkit/block'
import * as Message from 'foldkit/message'

const Model = Schema.Struct({ count: Schema.Number, label: Schema.String })
const ChildMessage = Message.defineMessageUnion({ Clicked: {}, Reset: {} })
const Def0 = Block.makeDefinition('Unit0', { Model, Message: ChildMessage })
const Comp0 = Def0.makeComposition()
export const Block0 = Def0.produceBlock(() => Comp0.assembleBlock({
    init: () => ({ model: Model.make({ count: 0, label: '' }) }),
    update: Comp0.makeUpdate((model, _message) => ({ model })),
    view: Comp0.makeView((model, h) => h.div([], [String(model.count), h.span([], [model.label])])),
  }))
const Def1 = Block.makeDefinition('Unit1', { Model, Message: ChildMessage })
const Comp1 = Def1.makeComposition()
export const Block1 = Def1.produceBlock(() => Comp1.assembleBlock({
    init: () => ({ model: Model.make({ count: 0, label: '' }) }),
    update: Comp1.makeUpdate((model, _message) => ({ model })),
    view: Comp1.makeView((model, h) => h.div([], [String(model.count), h.span([], [model.label])])),
  }))
const Def2 = Block.makeDefinition('Unit2', { Model, Message: ChildMessage })
const Comp2 = Def2.makeComposition()
export const Block2 = Def2.produceBlock(() => Comp2.assembleBlock({
    init: () => ({ model: Model.make({ count: 0, label: '' }) }),
    update: Comp2.makeUpdate((model, _message) => ({ model })),
    view: Comp2.makeView((model, h) => h.div([], [String(model.count), h.span([], [model.label])])),
  }))
const Def3 = Block.makeDefinition('Unit3', { Model, Message: ChildMessage })
const Comp3 = Def3.makeComposition()
export const Block3 = Def3.produceBlock(() => Comp3.assembleBlock({
    init: () => ({ model: Model.make({ count: 0, label: '' }) }),
    update: Comp3.makeUpdate((model, _message) => ({ model })),
    view: Comp3.makeView((model, h) => h.div([], [String(model.count), h.span([], [model.label])])),
  }))
const Def4 = Block.makeDefinition('Unit4', { Model, Message: ChildMessage })
const Comp4 = Def4.makeComposition()
export const Block4 = Def4.produceBlock(() => Comp4.assembleBlock({
    init: () => ({ model: Model.make({ count: 0, label: '' }) }),
    update: Comp4.makeUpdate((model, _message) => ({ model })),
    view: Comp4.makeView((model, h) => h.div([], [String(model.count), h.span([], [model.label])])),
  }))
const Def5 = Block.makeDefinition('Unit5', { Model, Message: ChildMessage })
const Comp5 = Def5.makeComposition()
export const Block5 = Def5.produceBlock(() => Comp5.assembleBlock({
    init: () => ({ model: Model.make({ count: 0, label: '' }) }),
    update: Comp5.makeUpdate((model, _message) => ({ model })),
    view: Comp5.makeView((model, h) => h.div([], [String(model.count), h.span([], [model.label])])),
  }))
const Def6 = Block.makeDefinition('Unit6', { Model, Message: ChildMessage })
const Comp6 = Def6.makeComposition()
export const Block6 = Def6.produceBlock(() => Comp6.assembleBlock({
    init: () => ({ model: Model.make({ count: 0, label: '' }) }),
    update: Comp6.makeUpdate((model, _message) => ({ model })),
    view: Comp6.makeView((model, h) => h.div([], [String(model.count), h.span([], [model.label])])),
  }))
const Def7 = Block.makeDefinition('Unit7', { Model, Message: ChildMessage })
const Comp7 = Def7.makeComposition()
export const Block7 = Def7.produceBlock(() => Comp7.assembleBlock({
    init: () => ({ model: Model.make({ count: 0, label: '' }) }),
    update: Comp7.makeUpdate((model, _message) => ({ model })),
    view: Comp7.makeView((model, h) => h.div([], [String(model.count), h.span([], [model.label])])),
  }))
const Def8 = Block.makeDefinition('Unit8', { Model, Message: ChildMessage })
const Comp8 = Def8.makeComposition()
export const Block8 = Def8.produceBlock(() => Comp8.assembleBlock({
    init: () => ({ model: Model.make({ count: 0, label: '' }) }),
    update: Comp8.makeUpdate((model, _message) => ({ model })),
    view: Comp8.makeView((model, h) => h.div([], [String(model.count), h.span([], [model.label])])),
  }))
const Def9 = Block.makeDefinition('Unit9', { Model, Message: ChildMessage })
const Comp9 = Def9.makeComposition()
export const Block9 = Def9.produceBlock(() => Comp9.assembleBlock({
    init: () => ({ model: Model.make({ count: 0, label: '' }) }),
    update: Comp9.makeUpdate((model, _message) => ({ model })),
    view: Comp9.makeView((model, h) => h.div([], [String(model.count), h.span([], [model.label])])),
  }))
const Def10 = Block.makeDefinition('Unit10', { Model, Message: ChildMessage })
const Comp10 = Def10.makeComposition()
export const Block10 = Def10.produceBlock(() => Comp10.assembleBlock({
    init: () => ({ model: Model.make({ count: 0, label: '' }) }),
    update: Comp10.makeUpdate((model, _message) => ({ model })),
    view: Comp10.makeView((model, h) => h.div([], [String(model.count), h.span([], [model.label])])),
  }))
const Def11 = Block.makeDefinition('Unit11', { Model, Message: ChildMessage })
const Comp11 = Def11.makeComposition()
export const Block11 = Def11.produceBlock(() => Comp11.assembleBlock({
    init: () => ({ model: Model.make({ count: 0, label: '' }) }),
    update: Comp11.makeUpdate((model, _message) => ({ model })),
    view: Comp11.makeView((model, h) => h.div([], [String(model.count), h.span([], [model.label])])),
  }))
const Def12 = Block.makeDefinition('Unit12', { Model, Message: ChildMessage })
const Comp12 = Def12.makeComposition()
export const Block12 = Def12.produceBlock(() => Comp12.assembleBlock({
    init: () => ({ model: Model.make({ count: 0, label: '' }) }),
    update: Comp12.makeUpdate((model, _message) => ({ model })),
    view: Comp12.makeView((model, h) => h.div([], [String(model.count), h.span([], [model.label])])),
  }))
const Def13 = Block.makeDefinition('Unit13', { Model, Message: ChildMessage })
const Comp13 = Def13.makeComposition()
export const Block13 = Def13.produceBlock(() => Comp13.assembleBlock({
    init: () => ({ model: Model.make({ count: 0, label: '' }) }),
    update: Comp13.makeUpdate((model, _message) => ({ model })),
    view: Comp13.makeView((model, h) => h.div([], [String(model.count), h.span([], [model.label])])),
  }))
const Def14 = Block.makeDefinition('Unit14', { Model, Message: ChildMessage })
const Comp14 = Def14.makeComposition()
export const Block14 = Def14.produceBlock(() => Comp14.assembleBlock({
    init: () => ({ model: Model.make({ count: 0, label: '' }) }),
    update: Comp14.makeUpdate((model, _message) => ({ model })),
    view: Comp14.makeView((model, h) => h.div([], [String(model.count), h.span([], [model.label])])),
  }))
const Def15 = Block.makeDefinition('Unit15', { Model, Message: ChildMessage })
const Comp15 = Def15.makeComposition()
export const Block15 = Def15.produceBlock(() => Comp15.assembleBlock({
    init: () => ({ model: Model.make({ count: 0, label: '' }) }),
    update: Comp15.makeUpdate((model, _message) => ({ model })),
    view: Comp15.makeView((model, h) => h.div([], [String(model.count), h.span([], [model.label])])),
  }))
const Def16 = Block.makeDefinition('Unit16', { Model, Message: ChildMessage })
const Comp16 = Def16.makeComposition()
export const Block16 = Def16.produceBlock(() => Comp16.assembleBlock({
    init: () => ({ model: Model.make({ count: 0, label: '' }) }),
    update: Comp16.makeUpdate((model, _message) => ({ model })),
    view: Comp16.makeView((model, h) => h.div([], [String(model.count), h.span([], [model.label])])),
  }))
const Def17 = Block.makeDefinition('Unit17', { Model, Message: ChildMessage })
const Comp17 = Def17.makeComposition()
export const Block17 = Def17.produceBlock(() => Comp17.assembleBlock({
    init: () => ({ model: Model.make({ count: 0, label: '' }) }),
    update: Comp17.makeUpdate((model, _message) => ({ model })),
    view: Comp17.makeView((model, h) => h.div([], [String(model.count), h.span([], [model.label])])),
  }))
const Def18 = Block.makeDefinition('Unit18', { Model, Message: ChildMessage })
const Comp18 = Def18.makeComposition()
export const Block18 = Def18.produceBlock(() => Comp18.assembleBlock({
    init: () => ({ model: Model.make({ count: 0, label: '' }) }),
    update: Comp18.makeUpdate((model, _message) => ({ model })),
    view: Comp18.makeView((model, h) => h.div([], [String(model.count), h.span([], [model.label])])),
  }))
const Def19 = Block.makeDefinition('Unit19', { Model, Message: ChildMessage })
const Comp19 = Def19.makeComposition()
export const Block19 = Def19.produceBlock(() => Comp19.assembleBlock({
    init: () => ({ model: Model.make({ count: 0, label: '' }) }),
    update: Comp19.makeUpdate((model, _message) => ({ model })),
    view: Comp19.makeView((model, h) => h.div([], [String(model.count), h.span([], [model.label])])),
  }))
