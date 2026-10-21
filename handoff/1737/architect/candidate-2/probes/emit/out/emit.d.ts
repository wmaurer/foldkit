import { Schema } from 'effect';
import { Block } from 'foldkit';
import * as Message from 'foldkit/message';
export declare const Model: Schema.Struct<{
    readonly count: Schema.Number;
}>;
export declare const ViewDef: Block.AuthoringDefinition<"EmitView", Schema.Struct<{
    readonly count: Schema.Number;
}>, Message.MessageUnion<{
    readonly Clicked: {};
}>, undefined, true, undefined>;
declare const assembleView: () => Block.CompletedWithView<Block.Composition<Block.Owner<"EmitView", true>, Schema.Struct<{
    readonly count: Schema.Number;
}>, Message.MessageUnion<{
    readonly Clicked: {};
}>, undefined, readonly [], readonly []>, Readonly<{
    EffectsLayer: import("effect/Layer").Layer<never, never, never>;
    init: () => {
        model: {
            readonly count: number;
        };
    };
    update: NoInfer<{
        (message: {
            readonly _tag: "Clicked";
        }): (model: {
            readonly count: number;
        }) => import("foldkit/update").Return<{
            readonly count: number;
        }, {
            readonly _tag: "Clicked";
        }, never>;
        (model: {
            readonly count: number;
        }, message: {
            readonly _tag: "Clicked";
        }): import("foldkit/update").Return<{
            readonly count: number;
        }, {
            readonly _tag: "Clicked";
        }, never>;
    }>;
    view: Block.OwnedAuthoredView<Block.View<{
        readonly count: number;
    }, {
        readonly _tag: "Clicked";
    }, void, never>, Block.Owner<"EmitView", true>, {
        readonly count: number;
    }, {
        readonly _tag: "Clicked";
    }, never>;
}>>;
export declare const ViewBlock: Block.ProducedBlockWithView<Block.Owner<"EmitView", true>, Schema.Struct<{
    readonly count: Schema.Number;
}>, typeof assembleView>;
export declare const ViewOutDef: Block.AuthoringDefinition<"EmitViewOut", Schema.Struct<{
    readonly count: Schema.Number;
}>, Message.MessageUnion<{
    readonly Clicked: {};
}>, Message.MessageUnion<{
    readonly Done: {};
}>, true, undefined>;
declare const assembleViewOut: () => Block.CompletedBlockWithViewAndOutMessage<Block.Owner<"EmitViewOut", true>, Schema.Struct<{
    readonly count: Schema.Number;
}>, Message.MessageUnion<{
    readonly Clicked: {};
}>, Message.MessageUnion<{
    readonly Done: {};
}>, readonly [], readonly [], Readonly<{
    readonly init: () => {
        model: {
            readonly count: number;
        };
    };
    readonly update: NoInfer<{
        (message: {
            readonly _tag: "Clicked";
        }): (model: {
            readonly count: number;
        }) => import("foldkit/update").Return<{
            readonly count: number;
        }, {
            readonly _tag: "Clicked";
        }, never>;
        (model: {
            readonly count: number;
        }, message: {
            readonly _tag: "Clicked";
        }): import("foldkit/update").Return<{
            readonly count: number;
        }, {
            readonly _tag: "Clicked";
        }, never>;
    }>;
    readonly EffectsLayer: import("effect/Layer").Layer<never, never, never>;
    readonly view: Block.OwnedAuthoredView<Block.View<{
        readonly count: number;
    }, {
        readonly _tag: "Clicked";
    }, void, never>, Block.Owner<"EmitViewOut", true>, {
        readonly count: number;
    }, {
        readonly _tag: "Clicked";
    }, never>;
}>>;
export declare const ViewOutBlock: Block.ProducedBlockWithViewAndOutMessage<Block.Owner<"EmitViewOut", true>, Schema.Struct<{
    readonly count: Schema.Number;
}>, Message.MessageUnion<{
    readonly Done: {};
}>, typeof assembleViewOut>;
export declare const HeadlessDef: Block.AuthoringDefinition<"EmitHeadless", Schema.Struct<{
    readonly count: Schema.Number;
}>, Message.MessageUnion<{
    readonly Clicked: {};
}>, undefined, true, undefined>;
declare const assembleHeadless: () => Block.CompletedBlockWithoutViewOrOutMessage<Block.Owner<"EmitHeadless", true>, Schema.Struct<{
    readonly count: Schema.Number;
}>, Message.MessageUnion<{
    readonly Clicked: {};
}>, readonly [], readonly [], Readonly<{
    readonly init: () => {
        model: {
            readonly count: number;
        };
    };
    readonly update: NoInfer<{
        (message: {
            readonly _tag: "Clicked";
        }): (model: {
            readonly count: number;
        }) => import("foldkit/update").Return<{
            readonly count: number;
        }, {
            readonly _tag: "Clicked";
        }, never>;
        (model: {
            readonly count: number;
        }, message: {
            readonly _tag: "Clicked";
        }): import("foldkit/update").Return<{
            readonly count: number;
        }, {
            readonly _tag: "Clicked";
        }, never>;
    }>;
    readonly EffectsLayer: import("effect/Layer").Layer<never, never, never>;
}>>;
export declare const HeadlessBlock: Block.ProducedBlockWithoutViewOrOutMessage<Block.Owner<"EmitHeadless", true>, Schema.Struct<{
    readonly count: Schema.Number;
}>, typeof assembleHeadless>;
declare const replaceLayer: () => Block.Block<Block.Owner<"EmitHeadless", true>, Schema.Struct<{
    readonly count: Schema.Number;
}>, Message.MessageUnion<{
    readonly Clicked: {};
}>, undefined, readonly [], readonly [], Readonly<{
    readonly init: () => {
        model: {
            readonly count: number;
        };
    };
    readonly update: NoInfer<{
        (message: {
            readonly _tag: "Clicked";
        }): (model: {
            readonly count: number;
        }) => import("foldkit/update").Return<{
            readonly count: number;
        }, {
            readonly _tag: "Clicked";
        }, never>;
        (model: {
            readonly count: number;
        }, message: {
            readonly _tag: "Clicked";
        }): import("foldkit/update").Return<{
            readonly count: number;
        }, {
            readonly _tag: "Clicked";
        }, never>;
    }>;
    readonly EffectsLayer: import("effect/Layer").Layer<never, never, never>;
}>>;
export declare const ReplacedBlock: Block.ProducedBlockWithoutViewOrOutMessage<Block.Owner<"EmitHeadless", true>, Schema.Struct<{
    readonly count: Schema.Number;
}>, typeof replaceLayer>;
export {};
