import { Block } from 'foldkit';
import { assembleForeign, assembleHeadlessForViewDefinition, assembleOutTwin, assembleSameId, assembleSameModel, assembleViewForHeadlessDefinition } from './produce-block-block.js';
declare const assembleErased: () => never;
declare const assembleAny: () => any;
export declare const Foreign: Block.ProducedBlockWithView<Block.Owner<"ProduceView", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, typeof assembleForeign>;
export declare const SameId: Block.ProducedBlockWithView<Block.Owner<"ProduceView", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, typeof assembleSameId>;
export declare const SameModel: Block.ProducedBlockWithView<Block.Owner<"ProduceView", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, typeof assembleSameModel>;
export declare const OutTwin: Block.ProducedBlockWithView<Block.Owner<"ProduceView", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, typeof assembleOutTwin>;
export declare const Never: Block.ProducedBlockWithView<Block.Owner<"ProduceView", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, never>;
export declare const NotFunction: Block.ProducedBlockWithView<Block.Owner<"ProduceView", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, Block.CompletedWithView<Block.Composition<Block.Owner<"ProduceView", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, import("foldkit/message").MessageUnion<{
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
    }, void, never>, Block.Owner<"ProduceView", true>, {
        readonly count: number;
    }, {
        readonly _tag: "Clicked";
    }, never>;
}>>>;
export declare const WithParameter: Block.ProducedBlockWithView<Block.Owner<"ProduceView", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, (_value: number) => Block.CompletedWithView<Block.Composition<Block.Owner<"ProduceView", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, import("foldkit/message").MessageUnion<{
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
    }, void, never>, Block.Owner<"ProduceView", true>, {
        readonly count: number;
    }, {
        readonly _tag: "Clicked";
    }, never>;
}>>>;
export declare const Any: Block.ProducedBlockWithView<Block.Owner<"ProduceView", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, typeof assembleAny>;
export declare const Erased: Block.ProducedBlockWithView<Block.Owner<"ProduceView", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, typeof assembleErased>;
export declare const ViewButHeadless: Block.ProducedBlockWithView<Block.Owner<"ProduceView", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, typeof assembleHeadlessForViewDefinition>;
export declare const HeadlessButView: Block.ProducedBlockWithoutViewOrOutMessage<Block.Owner<"ProduceHeadless", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, typeof assembleViewForHeadlessDefinition>;
export {};
