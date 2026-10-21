import { Schema } from 'effect';
import * as Block from 'foldkit/block';
import * as Message from 'foldkit/message';
export declare const Model: Schema.Struct<{
    readonly count: Schema.Number;
}>;
declare const assembleEmitBlock: () => Block.CompletedWithView<Block.Composition<Block.Owner<"Emit", true>, Schema.Struct<{
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
    }, void, never>, Block.Owner<"Emit", true>, {
        readonly count: number;
    }, {
        readonly _tag: "Clicked";
    }, never>;
}>>;
export declare const EmitBlock: import("./produced.js").ProducedBlockWithView<Block.Owner<"Emit", true>, Schema.Struct<{
    readonly count: Schema.Number;
}>, typeof assembleEmitBlock>;
export {};
