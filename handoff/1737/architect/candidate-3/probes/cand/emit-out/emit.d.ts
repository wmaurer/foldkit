import { Schema } from 'effect';
import * as Block from 'foldkit/block';
import * as Message from 'foldkit/message';
export declare const Model: Schema.Struct<{
    readonly count: Schema.Number;
}>;
export declare const ChildMessage: Message.MessageUnion<{
    readonly Clicked: {};
}>;
export declare const ChildOutMessage: Message.MessageUnion<{
    readonly Done: {};
}>;
export declare const ViewDefinition: Block.AuthoringDefinition<"EmitView", Schema.Struct<{
    readonly count: Schema.Number;
}>, Message.MessageUnion<{
    readonly Clicked: {};
}>, undefined, true, undefined>;
export declare const ViewComposition: Block.Composition<Block.Owner<"EmitView", true>, Schema.Struct<{
    readonly count: Schema.Number;
}>, Message.MessageUnion<{
    readonly Clicked: {};
}>, undefined, readonly [], readonly []>;
export declare const ViewBlock: Block.ProducedBlockWithoutOutMessage<Block.Owner<"EmitView", true>, Schema.Struct<{
    readonly count: Schema.Number;
}>, () => NoInfer<Block.CompletedWithView<Block.Composition<Block.Owner<"EmitView", true>, Schema.Struct<{
    readonly count: Schema.Number;
}>, Message.MessageUnion<{
    readonly Clicked: {};
}>, undefined, readonly [], readonly []>, Readonly<{
    EffectsLayer: import("effect/Layer").Layer<never, never, never>;
    init: NoInfer<() => import("foldkit/update").Return<{
        readonly count: number;
    }, {
        readonly _tag: "Clicked";
    }, never>>;
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
}>>>>;
export declare const HeadlessDefinition: Block.AuthoringDefinition<"EmitHeadless", Schema.Struct<{
    readonly count: Schema.Number;
}>, Message.MessageUnion<{
    readonly Clicked: {};
}>, Message.MessageUnion<{
    readonly Done: {};
}>, true, undefined>;
export declare const HeadlessComposition: Block.Composition<Block.Owner<"EmitHeadless", true>, Schema.Struct<{
    readonly count: Schema.Number;
}>, Message.MessageUnion<{
    readonly Clicked: {};
}>, Message.MessageUnion<{
    readonly Done: {};
}>, readonly [], readonly []>;
export declare const HeadlessBlock: Block.ProducedBlockWithOutMessage<Block.Owner<"EmitHeadless", true>, Schema.Struct<{
    readonly count: Schema.Number;
}>, () => NoInfer<Block.CompletedBlockWithOutMessage<Block.Owner<"EmitHeadless", true>, Schema.Struct<{
    readonly count: Schema.Number;
}>, Message.MessageUnion<{
    readonly Clicked: {};
}>, Message.MessageUnion<{
    readonly Done: {};
}>, readonly [], readonly [], Readonly<{
    readonly init: NoInfer<() => import("foldkit/update").Return<{
        readonly count: number;
    }, {
        readonly _tag: "Clicked";
    }, never>>;
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
}>>>>;
