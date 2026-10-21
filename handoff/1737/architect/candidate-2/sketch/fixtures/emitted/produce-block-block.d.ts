import { Layer } from 'effect';
export declare const ViewComposition: import("foldkit/block").Composition<import("foldkit/block").Owner<"ProduceView", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, import("foldkit/message").MessageUnion<{
    readonly Clicked: {};
}>, undefined, readonly [], readonly []>;
export declare const ViewAssembled: import("foldkit/block").CompletedWithView<import("foldkit/block").Composition<import("foldkit/block").Owner<"ProduceView", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, import("foldkit/message").MessageUnion<{
    readonly Clicked: {};
}>, undefined, readonly [], readonly []>, Readonly<{
    EffectsLayer: Layer.Layer<never, never, never>;
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
    view: import("foldkit/block").OwnedAuthoredView<import("foldkit/block").View<{
        readonly count: number;
    }, {
        readonly _tag: "Clicked";
    }, void, never>, import("foldkit/block").Owner<"ProduceView", true>, {
        readonly count: number;
    }, {
        readonly _tag: "Clicked";
    }, never>;
}>>;
export declare const assembleView: () => import("foldkit/block").CompletedWithView<import("foldkit/block").Composition<import("foldkit/block").Owner<"ProduceView", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, import("foldkit/message").MessageUnion<{
    readonly Clicked: {};
}>, undefined, readonly [], readonly []>, Readonly<{
    EffectsLayer: Layer.Layer<never, never, never>;
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
    view: import("foldkit/block").OwnedAuthoredView<import("foldkit/block").View<{
        readonly count: number;
    }, {
        readonly _tag: "Clicked";
    }, void, never>, import("foldkit/block").Owner<"ProduceView", true>, {
        readonly count: number;
    }, {
        readonly _tag: "Clicked";
    }, never>;
}>>;
export declare const ViewBlock: import("foldkit/block").ProducedBlockWithView<import("foldkit/block").Owner<"ProduceView", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, typeof assembleView>;
export declare const assembleReplacedView: () => import("foldkit/block").Block<import("foldkit/block").Owner<"ProduceView", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, import("foldkit/message").MessageUnion<{
    readonly Clicked: {};
}>, undefined, readonly [], readonly [], Readonly<{
    readonly EffectsLayer: Layer.Layer<never, never, never>;
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
    readonly view: import("foldkit/block").OwnedAuthoredView<import("foldkit/block").View<{
        readonly count: number;
    }, {
        readonly _tag: "Clicked";
    }, void, never>, import("foldkit/block").Owner<"ProduceView", true>, {
        readonly count: number;
    }, {
        readonly _tag: "Clicked";
    }, never>;
}>>;
export declare const ReplacedViewBlock: import("foldkit/block").ProducedBlockWithView<import("foldkit/block").Owner<"ProduceView", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, typeof assembleReplacedView>;
export declare const ViewOutComposition: import("foldkit/block").Composition<import("foldkit/block").Owner<"ProduceViewOut", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, import("foldkit/message").MessageUnion<{
    readonly Clicked: {};
}>, import("foldkit/message").MessageUnion<{
    readonly Done: {};
}>, readonly [], readonly []>;
export declare const ViewOutAssembled: import("foldkit/block").CompletedBlockWithViewAndOutMessage<import("foldkit/block").Owner<"ProduceViewOut", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, import("foldkit/message").MessageUnion<{
    readonly Clicked: {};
}>, import("foldkit/message").MessageUnion<{
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
    readonly EffectsLayer: Layer.Layer<never, never, never>;
    readonly view: import("foldkit/block").OwnedAuthoredView<import("foldkit/block").View<{
        readonly count: number;
    }, {
        readonly _tag: "Clicked";
    }, void, never>, import("foldkit/block").Owner<"ProduceViewOut", true>, {
        readonly count: number;
    }, {
        readonly _tag: "Clicked";
    }, never>;
}>>;
export declare const assembleViewOut: () => import("foldkit/block").CompletedBlockWithViewAndOutMessage<import("foldkit/block").Owner<"ProduceViewOut", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, import("foldkit/message").MessageUnion<{
    readonly Clicked: {};
}>, import("foldkit/message").MessageUnion<{
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
    readonly EffectsLayer: Layer.Layer<never, never, never>;
    readonly view: import("foldkit/block").OwnedAuthoredView<import("foldkit/block").View<{
        readonly count: number;
    }, {
        readonly _tag: "Clicked";
    }, void, never>, import("foldkit/block").Owner<"ProduceViewOut", true>, {
        readonly count: number;
    }, {
        readonly _tag: "Clicked";
    }, never>;
}>>;
export declare const ViewOutBlock: import("foldkit/block").ProducedBlockWithViewAndOutMessage<import("foldkit/block").Owner<"ProduceViewOut", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, import("foldkit/message").MessageUnion<{
    readonly Done: {};
}>, typeof assembleViewOut>;
export declare const HeadlessComposition: import("foldkit/block").Composition<import("foldkit/block").Owner<"ProduceHeadless", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, import("foldkit/message").MessageUnion<{
    readonly Clicked: {};
}>, undefined, readonly [], readonly []>;
export declare const HeadlessAssembled: import("foldkit/block").CompletedBlockWithoutViewOrOutMessage<import("foldkit/block").Owner<"ProduceHeadless", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, import("foldkit/message").MessageUnion<{
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
    readonly EffectsLayer: Layer.Layer<never, never, never>;
}>>;
export declare const assembleHeadless: () => import("foldkit/block").CompletedBlockWithoutViewOrOutMessage<import("foldkit/block").Owner<"ProduceHeadless", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, import("foldkit/message").MessageUnion<{
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
    readonly EffectsLayer: Layer.Layer<never, never, never>;
}>>;
export declare const HeadlessBlock: import("foldkit/block").ProducedBlockWithoutViewOrOutMessage<import("foldkit/block").Owner<"ProduceHeadless", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, typeof assembleHeadless>;
export declare const HeadlessOutComposition: import("foldkit/block").Composition<import("foldkit/block").Owner<"ProduceHeadlessOut", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, import("foldkit/message").MessageUnion<{
    readonly Clicked: {};
}>, import("foldkit/message").MessageUnion<{
    readonly Done: {};
}>, readonly [], readonly []>;
export declare const HeadlessOutAssembled: import("foldkit/block").CompletedBlockWithOutMessage<import("foldkit/block").Owner<"ProduceHeadlessOut", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, import("foldkit/message").MessageUnion<{
    readonly Clicked: {};
}>, import("foldkit/message").MessageUnion<{
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
    readonly EffectsLayer: Layer.Layer<never, never, never>;
}>>;
export declare const assembleHeadlessOut: () => import("foldkit/block").CompletedBlockWithOutMessage<import("foldkit/block").Owner<"ProduceHeadlessOut", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, import("foldkit/message").MessageUnion<{
    readonly Clicked: {};
}>, import("foldkit/message").MessageUnion<{
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
    readonly EffectsLayer: Layer.Layer<never, never, never>;
}>>;
export declare const HeadlessOutBlock: import("foldkit/block").ProducedBlockWithOutMessage<import("foldkit/block").Owner<"ProduceHeadlessOut", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, import("foldkit/message").MessageUnion<{
    readonly Done: {};
}>, typeof assembleHeadlessOut>;
export declare const assembleHeadlessForViewDefinition: () => import("foldkit/block").CompletedBlockWithoutViewOrOutMessage<import("foldkit/block").Owner<"ProduceView", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, import("foldkit/message").MessageUnion<{
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
    readonly EffectsLayer: Layer.Layer<never, never, never>;
}>>;
export declare const assembleViewForHeadlessDefinition: () => import("foldkit/block").CompletedWithView<import("foldkit/block").Composition<import("foldkit/block").Owner<"ProduceHeadless", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, import("foldkit/message").MessageUnion<{
    readonly Clicked: {};
}>, undefined, readonly [], readonly []>, Readonly<{
    EffectsLayer: Layer.Layer<never, never, never>;
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
    view: import("foldkit/block").OwnedAuthoredView<import("foldkit/block").View<{
        readonly count: number;
    }, {
        readonly _tag: "Clicked";
    }, void, never>, import("foldkit/block").Owner<"ProduceHeadless", true>, {
        readonly count: number;
    }, {
        readonly _tag: "Clicked";
    }, never>;
}>>;
export declare const assembleForeign: () => import("foldkit/block").CompletedWithView<import("foldkit/block").Composition<import("foldkit/block").Owner<"ProduceForeign", true>, import("effect/Schema").Struct<{
    readonly name: import("effect/Schema").String;
}>, import("foldkit/message").MessageUnion<{
    readonly Clicked: {};
}>, undefined, readonly [], readonly []>, Readonly<{
    EffectsLayer: Layer.Layer<never, never, never>;
    init: () => {
        model: {
            readonly name: string;
        };
    };
    update: NoInfer<{
        (message: {
            readonly _tag: "Clicked";
        }): (model: {
            readonly name: string;
        }) => import("foldkit/update").Return<{
            readonly name: string;
        }, {
            readonly _tag: "Clicked";
        }, never>;
        (model: {
            readonly name: string;
        }, message: {
            readonly _tag: "Clicked";
        }): import("foldkit/update").Return<{
            readonly name: string;
        }, {
            readonly _tag: "Clicked";
        }, never>;
    }>;
    view: import("foldkit/block").OwnedAuthoredView<import("foldkit/block").View<{
        readonly name: string;
    }, {
        readonly _tag: "Clicked";
    }, void, never>, import("foldkit/block").Owner<"ProduceForeign", true>, {
        readonly name: string;
    }, {
        readonly _tag: "Clicked";
    }, never>;
}>>;
export declare const assembleSameModel: () => import("foldkit/block").CompletedWithView<import("foldkit/block").Composition<import("foldkit/block").Owner<"ProduceSameModel", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, import("foldkit/message").MessageUnion<{
    readonly Clicked: {};
}>, undefined, readonly [], readonly []>, Readonly<{
    EffectsLayer: Layer.Layer<never, never, never>;
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
    view: import("foldkit/block").OwnedAuthoredView<import("foldkit/block").View<{
        readonly count: number;
    }, {
        readonly _tag: "Clicked";
    }, void, never>, import("foldkit/block").Owner<"ProduceSameModel", true>, {
        readonly count: number;
    }, {
        readonly _tag: "Clicked";
    }, never>;
}>>;
export declare const assembleSameId: () => import("foldkit/block").CompletedWithView<import("foldkit/block").Composition<import("foldkit/block").Owner<"ProduceView", true>, import("effect/Schema").Struct<{
    readonly name: import("effect/Schema").String;
}>, import("foldkit/message").MessageUnion<{
    readonly Clicked: {};
}>, undefined, readonly [], readonly []>, Readonly<{
    EffectsLayer: Layer.Layer<never, never, never>;
    init: () => {
        model: {
            readonly name: string;
        };
    };
    update: NoInfer<{
        (message: {
            readonly _tag: "Clicked";
        }): (model: {
            readonly name: string;
        }) => import("foldkit/update").Return<{
            readonly name: string;
        }, {
            readonly _tag: "Clicked";
        }, never>;
        (model: {
            readonly name: string;
        }, message: {
            readonly _tag: "Clicked";
        }): import("foldkit/update").Return<{
            readonly name: string;
        }, {
            readonly _tag: "Clicked";
        }, never>;
    }>;
    view: import("foldkit/block").OwnedAuthoredView<import("foldkit/block").View<{
        readonly name: string;
    }, {
        readonly _tag: "Clicked";
    }, void, never>, import("foldkit/block").Owner<"ProduceView", true>, {
        readonly name: string;
    }, {
        readonly _tag: "Clicked";
    }, never>;
}>>;
export declare const assembleTwin: () => import("foldkit/block").CompletedWithView<import("foldkit/block").Composition<import("foldkit/block").Owner<"ProduceView", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, import("foldkit/message").MessageUnion<{
    readonly Clicked: {};
}>, undefined, readonly [], readonly []>, Readonly<{
    EffectsLayer: Layer.Layer<never, never, never>;
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
    view: import("foldkit/block").OwnedAuthoredView<import("foldkit/block").View<{
        readonly count: number;
    }, {
        readonly _tag: "Clicked";
    }, void, never>, import("foldkit/block").Owner<"ProduceView", true>, {
        readonly count: number;
    }, {
        readonly _tag: "Clicked";
    }, never>;
}>>;
export declare const assembleOutTwin: () => import("foldkit/block").CompletedBlockWithViewAndOutMessage<import("foldkit/block").Owner<"ProduceView", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, import("foldkit/message").MessageUnion<{
    readonly Clicked: {};
}>, import("foldkit/message").MessageUnion<{
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
    readonly EffectsLayer: Layer.Layer<never, never, never>;
    readonly view: import("foldkit/block").OwnedAuthoredView<import("foldkit/block").View<{
        readonly count: number;
    }, {
        readonly _tag: "Clicked";
    }, void, never>, import("foldkit/block").Owner<"ProduceView", true>, {
        readonly count: number;
    }, {
        readonly _tag: "Clicked";
    }, never>;
}>>;
