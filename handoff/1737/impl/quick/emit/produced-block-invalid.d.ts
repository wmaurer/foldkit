import type { Block } from 'foldkit';
import { assembleViewBlock, assembleViewlessBlock } from './produced-block-block.js';
declare const assembleForeignBlock: () => Block.CompletedWithView<Block.Composition<Block.Owner<"ProducedForeign", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, import("../dist/schema/index.js").MessageUnion<{
    readonly ClickedIncrement: {};
    readonly CompletedSaveCount: {};
}>, undefined, readonly [], readonly []>, Readonly<{
    EffectsLayer: import("effect/Layer").Layer<never, never, never>;
    init: () => {
        model: {
            readonly count: number;
        };
    };
    update: NoInfer<{
        (message: {
            readonly _tag: "ClickedIncrement";
        } | {
            readonly _tag: "CompletedSaveCount";
        }): (model: {
            readonly count: number;
        }) => import("../dist/update/update.js").Return<{
            readonly count: number;
        }, {
            readonly _tag: "ClickedIncrement";
        } | {
            readonly _tag: "CompletedSaveCount";
        }, never>;
        (model: {
            readonly count: number;
        }, message: {
            readonly _tag: "ClickedIncrement";
        } | {
            readonly _tag: "CompletedSaveCount";
        }): import("../dist/update/update.js").Return<{
            readonly count: number;
        }, {
            readonly _tag: "ClickedIncrement";
        } | {
            readonly _tag: "CompletedSaveCount";
        }, never>;
    }>;
    view: Block.OwnedAuthoredView<Block.View<{
        readonly count: number;
    }, {
        readonly _tag: "ClickedIncrement";
    } | {
        readonly _tag: "CompletedSaveCount";
    }, void, never>, Block.Owner<"ProducedForeign", true>, {
        readonly count: number;
    }, {
        readonly _tag: "ClickedIncrement";
    } | {
        readonly _tag: "CompletedSaveCount";
    }, never>;
}>>;
declare const assembleSameIdBlock: () => Block.CompletedWithView<Block.Composition<Block.Owner<"ProducedView", true>, import("effect/Schema").Struct<{
    readonly name: import("effect/Schema").String;
}>, import("../dist/schema/index.js").MessageUnion<{
    readonly ClickedIncrement: {};
    readonly CompletedSaveCount: {};
}>, undefined, readonly [], readonly []>, Readonly<{
    EffectsLayer: import("effect/Layer").Layer<never, never, never>;
    init: () => {
        model: {
            readonly name: string;
        };
    };
    update: NoInfer<{
        (message: {
            readonly _tag: "ClickedIncrement";
        } | {
            readonly _tag: "CompletedSaveCount";
        }): (model: {
            readonly name: string;
        }) => import("../dist/update/update.js").Return<{
            readonly name: string;
        }, {
            readonly _tag: "ClickedIncrement";
        } | {
            readonly _tag: "CompletedSaveCount";
        }, never>;
        (model: {
            readonly name: string;
        }, message: {
            readonly _tag: "ClickedIncrement";
        } | {
            readonly _tag: "CompletedSaveCount";
        }): import("../dist/update/update.js").Return<{
            readonly name: string;
        }, {
            readonly _tag: "ClickedIncrement";
        } | {
            readonly _tag: "CompletedSaveCount";
        }, never>;
    }>;
    view: Block.OwnedAuthoredView<Block.View<{
        readonly name: string;
    }, {
        readonly _tag: "ClickedIncrement";
    } | {
        readonly _tag: "CompletedSaveCount";
    }, void, never>, Block.Owner<"ProducedView", true>, {
        readonly name: string;
    }, {
        readonly _tag: "ClickedIncrement";
    } | {
        readonly _tag: "CompletedSaveCount";
    }, never>;
}>>;
declare const assembleErasedBlock: () => never;
declare const assembleAnyBlock: () => any;
declare const assembleEnrichedBlock: () => Block.CompletedWithView<Block.Composition<Block.Owner<"ProducedView", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, import("../dist/schema/index.js").MessageUnion<{
    readonly ClickedIncrement: {};
    readonly CompletedSaveCount: {};
}>, undefined, readonly [], readonly []>, Readonly<{
    EffectsLayer: import("effect/Layer").Layer<never, never, never>;
    init: () => {
        model: {
            readonly count: number;
        };
    };
    update: NoInfer<{
        (message: {
            readonly _tag: "ClickedIncrement";
        } | {
            readonly _tag: "CompletedSaveCount";
        }): (model: {
            readonly count: number;
        }) => import("../dist/update/update.js").Return<{
            readonly count: number;
        }, {
            readonly _tag: "ClickedIncrement";
        } | {
            readonly _tag: "CompletedSaveCount";
        }, never>;
        (model: {
            readonly count: number;
        }, message: {
            readonly _tag: "ClickedIncrement";
        } | {
            readonly _tag: "CompletedSaveCount";
        }): import("../dist/update/update.js").Return<{
            readonly count: number;
        }, {
            readonly _tag: "ClickedIncrement";
        } | {
            readonly _tag: "CompletedSaveCount";
        }, never>;
    }>;
    view: Block.OwnedAuthoredView<Block.View<{
        readonly count: number;
    }, {
        readonly _tag: "ClickedIncrement";
    } | {
        readonly _tag: "CompletedSaveCount";
    }, void, never>, Block.Owner<"ProducedView", true>, {
        readonly count: number;
    }, {
        readonly _tag: "ClickedIncrement";
    } | {
        readonly _tag: "CompletedSaveCount";
    }, never>;
}>> & {
    extra: number;
};
export declare const ForeignBlock: Block.ProducedBlockWithView<Block.Owner<"ProducedView", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, typeof assembleForeignBlock>;
export declare const SameIdBlock: Block.ProducedBlockWithView<Block.Owner<"ProducedView", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, typeof assembleSameIdBlock>;
export declare const NeverBlock: Block.ProducedBlockWithView<Block.Owner<"ProducedView", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, never>;
export declare const ErasedBlock: Block.ProducedBlockWithView<Block.Owner<"ProducedView", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, typeof assembleErasedBlock>;
export declare const NotFunctionBlock: Block.ProducedBlockWithView<Block.Owner<"ProducedView", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, Block.CompletedWithView<Block.Composition<Block.Owner<"ProducedView", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, import("../dist/schema/index.js").MessageUnion<{
    readonly ClickedIncrement: {};
    readonly CompletedSaveCount: {};
}>, undefined, readonly [], readonly []>, Readonly<{
    EffectsLayer: import("effect/Layer").Layer<never, never, never>;
    init: () => {
        model: {
            readonly count: number;
        };
    };
    update: NoInfer<{
        (message: {
            readonly _tag: "ClickedIncrement";
        } | {
            readonly _tag: "CompletedSaveCount";
        }): (model: {
            readonly count: number;
        }) => import("../dist/update/update.js").Return<{
            readonly count: number;
        }, {
            readonly _tag: "ClickedIncrement";
        } | {
            readonly _tag: "CompletedSaveCount";
        }, never>;
        (model: {
            readonly count: number;
        }, message: {
            readonly _tag: "ClickedIncrement";
        } | {
            readonly _tag: "CompletedSaveCount";
        }): import("../dist/update/update.js").Return<{
            readonly count: number;
        }, {
            readonly _tag: "ClickedIncrement";
        } | {
            readonly _tag: "CompletedSaveCount";
        }, never>;
    }>;
    view: Block.OwnedAuthoredView<Block.View<{
        readonly count: number;
    }, {
        readonly _tag: "ClickedIncrement";
    } | {
        readonly _tag: "CompletedSaveCount";
    }, void, never>, Block.Owner<"ProducedView", true>, {
        readonly count: number;
    }, {
        readonly _tag: "ClickedIncrement";
    } | {
        readonly _tag: "CompletedSaveCount";
    }, never>;
}>>>;
export declare const ParameterBlock: Block.ProducedBlockWithView<Block.Owner<"ProducedView", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, (_count: number) => Block.CompletedWithView<Block.Composition<Block.Owner<"ProducedView", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, import("../dist/schema/index.js").MessageUnion<{
    readonly ClickedIncrement: {};
    readonly CompletedSaveCount: {};
}>, undefined, readonly [], readonly []>, Readonly<{
    EffectsLayer: import("effect/Layer").Layer<never, never, never>;
    init: () => {
        model: {
            readonly count: number;
        };
    };
    update: NoInfer<{
        (message: {
            readonly _tag: "ClickedIncrement";
        } | {
            readonly _tag: "CompletedSaveCount";
        }): (model: {
            readonly count: number;
        }) => import("../dist/update/update.js").Return<{
            readonly count: number;
        }, {
            readonly _tag: "ClickedIncrement";
        } | {
            readonly _tag: "CompletedSaveCount";
        }, never>;
        (model: {
            readonly count: number;
        }, message: {
            readonly _tag: "ClickedIncrement";
        } | {
            readonly _tag: "CompletedSaveCount";
        }): import("../dist/update/update.js").Return<{
            readonly count: number;
        }, {
            readonly _tag: "ClickedIncrement";
        } | {
            readonly _tag: "CompletedSaveCount";
        }, never>;
    }>;
    view: Block.OwnedAuthoredView<Block.View<{
        readonly count: number;
    }, {
        readonly _tag: "ClickedIncrement";
    } | {
        readonly _tag: "CompletedSaveCount";
    }, void, never>, Block.Owner<"ProducedView", true>, {
        readonly count: number;
    }, {
        readonly _tag: "ClickedIncrement";
    } | {
        readonly _tag: "CompletedSaveCount";
    }, never>;
}>>>;
export declare const AnyProducerBlock: Block.ProducedBlockWithView<Block.Owner<"ProducedView", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, any>;
export declare const AnyResultBlock: Block.ProducedBlockWithView<Block.Owner<"ProducedView", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, typeof assembleAnyBlock>;
export declare const EnrichedBlock: Block.ProducedBlockWithView<Block.Owner<"ProducedView", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, typeof assembleEnrichedBlock>;
export declare const MissingViewBlock: Block.ProducedBlockWithView<Block.Owner<"ProducedViewless", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, typeof assembleViewlessBlock>;
export declare const UnexpectedViewBlock: Block.ProducedBlockWithoutViewOrOutMessage<Block.Owner<"ProducedView", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, typeof assembleViewBlock>;
export {};
