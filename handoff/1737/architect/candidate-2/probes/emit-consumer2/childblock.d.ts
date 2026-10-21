import { Schema } from 'effect';
import { Block } from 'foldkit';
import * as Message from 'foldkit/message';
export declare const Model: Schema.Struct<{
    readonly count: Schema.Number;
}>;
export declare const ChildDefinition: Block.AuthoringDefinition<"XChild", Schema.Struct<{
    readonly count: Schema.Number;
}>, Message.MessageUnion<{
    readonly Clicked: {};
}>, undefined, true, undefined>;
declare const assembleChild: () => Block.CompletedWithView<Block.Composition<Block.Owner<"XChild", true>, Schema.Struct<{
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
    }, void, never>, Block.Owner<"XChild", true>, {
        readonly count: number;
    }, {
        readonly _tag: "Clicked";
    }, never>;
}>>;
export declare const ChildBlock: Block.ProducedBlockWithView<Block.Owner<"XChild", true>, Schema.Struct<{
    readonly count: Schema.Number;
}>, typeof assembleChild>;
export {};
