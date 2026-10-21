import { Layer } from 'effect';
export declare const assembleViewBlock: () => import("../dist/block/definition.js").CompletedWithView<import("../dist/block/definition.js").Composition<import("../dist/block/owner.js").Owner<"ProducedView", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, import("../dist/schema/index.js").MessageUnion<{
    readonly ClickedIncrement: {};
    readonly CompletedSaveCount: {};
}>, undefined, readonly [], readonly []>, Readonly<{
    EffectsLayer: Layer.Layer<never, never, never>;
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
    view: import("../dist/block/definition.js").OwnedAuthoredView<import("../dist/html/block.js").BlockView<{
        readonly count: number;
    }, {
        readonly _tag: "ClickedIncrement";
    } | {
        readonly _tag: "CompletedSaveCount";
    }, void, never>, import("../dist/block/owner.js").Owner<"ProducedView", true>, {
        readonly count: number;
    }, {
        readonly _tag: "ClickedIncrement";
    } | {
        readonly _tag: "CompletedSaveCount";
    }, never>;
}>>;
export declare const AssembledViewBlock: import("../dist/block/definition.js").CompletedWithView<import("../dist/block/definition.js").Composition<import("../dist/block/owner.js").Owner<"ProducedView", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, import("../dist/schema/index.js").MessageUnion<{
    readonly ClickedIncrement: {};
    readonly CompletedSaveCount: {};
}>, undefined, readonly [], readonly []>, Readonly<{
    EffectsLayer: Layer.Layer<never, never, never>;
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
    view: import("../dist/block/definition.js").OwnedAuthoredView<import("../dist/html/block.js").BlockView<{
        readonly count: number;
    }, {
        readonly _tag: "ClickedIncrement";
    } | {
        readonly _tag: "CompletedSaveCount";
    }, void, never>, import("../dist/block/owner.js").Owner<"ProducedView", true>, {
        readonly count: number;
    }, {
        readonly _tag: "ClickedIncrement";
    } | {
        readonly _tag: "CompletedSaveCount";
    }, never>;
}>>;
export declare const ViewBlock: import("../dist/block/produced.js").ProducedBlockWithView<import("../dist/block/owner.js").Owner<"ProducedView", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, typeof assembleViewBlock>;
export declare const assembleViewlessBlock: () => import("../dist/block/definition.js").CompletedBlockWithoutViewOrOutMessage<import("../dist/block/owner.js").Owner<"ProducedViewless", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, import("../dist/schema/index.js").MessageUnion<{
    readonly ClickedIncrement: {};
    readonly CompletedSaveCount: {};
}>, readonly [], readonly [], Readonly<{
    readonly init: () => {
        model: {
            readonly count: number;
        };
    };
    readonly update: NoInfer<{
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
    readonly EffectsLayer: Layer.Layer<never, never, never>;
}>>;
export declare const AssembledViewlessBlock: import("../dist/block/definition.js").CompletedBlockWithoutViewOrOutMessage<import("../dist/block/owner.js").Owner<"ProducedViewless", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, import("../dist/schema/index.js").MessageUnion<{
    readonly ClickedIncrement: {};
    readonly CompletedSaveCount: {};
}>, readonly [], readonly [], Readonly<{
    readonly init: () => {
        model: {
            readonly count: number;
        };
    };
    readonly update: NoInfer<{
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
    readonly EffectsLayer: Layer.Layer<never, never, never>;
}>>;
export declare const ViewlessBlock: import("../dist/block/produced.js").ProducedBlockWithoutViewOrOutMessage<import("../dist/block/owner.js").Owner<"ProducedViewless", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, typeof assembleViewlessBlock>;
export declare const assembleViewOutBlock: () => import("../dist/block/definition.js").CompletedBlockWithViewAndOutMessage<import("../dist/block/owner.js").Owner<"ProducedViewOut", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, import("../dist/schema/index.js").MessageUnion<{
    readonly ClickedIncrement: {};
    readonly CompletedSaveCount: {};
}>, import("../dist/schema/index.js").MessageUnion<{
    readonly ReachedLimit: {};
}>, readonly [], readonly [], Readonly<{
    readonly init: () => {
        model: {
            readonly count: number;
        };
    };
    readonly update: NoInfer<{
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
    readonly EffectsLayer: Layer.Layer<never, never, never>;
    readonly view: import("../dist/block/definition.js").OwnedAuthoredView<import("../dist/html/block.js").BlockView<{
        readonly count: number;
    }, {
        readonly _tag: "ClickedIncrement";
    } | {
        readonly _tag: "CompletedSaveCount";
    }, void, never>, import("../dist/block/owner.js").Owner<"ProducedViewOut", true>, {
        readonly count: number;
    }, {
        readonly _tag: "ClickedIncrement";
    } | {
        readonly _tag: "CompletedSaveCount";
    }, never>;
}>>;
export declare const AssembledViewOutBlock: import("../dist/block/definition.js").CompletedBlockWithViewAndOutMessage<import("../dist/block/owner.js").Owner<"ProducedViewOut", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, import("../dist/schema/index.js").MessageUnion<{
    readonly ClickedIncrement: {};
    readonly CompletedSaveCount: {};
}>, import("../dist/schema/index.js").MessageUnion<{
    readonly ReachedLimit: {};
}>, readonly [], readonly [], Readonly<{
    readonly init: () => {
        model: {
            readonly count: number;
        };
    };
    readonly update: NoInfer<{
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
    readonly EffectsLayer: Layer.Layer<never, never, never>;
    readonly view: import("../dist/block/definition.js").OwnedAuthoredView<import("../dist/html/block.js").BlockView<{
        readonly count: number;
    }, {
        readonly _tag: "ClickedIncrement";
    } | {
        readonly _tag: "CompletedSaveCount";
    }, void, never>, import("../dist/block/owner.js").Owner<"ProducedViewOut", true>, {
        readonly count: number;
    }, {
        readonly _tag: "ClickedIncrement";
    } | {
        readonly _tag: "CompletedSaveCount";
    }, never>;
}>>;
export declare const ViewOutBlock: import("../dist/block/produced.js").ProducedBlockWithViewAndOutMessage<import("../dist/block/owner.js").Owner<"ProducedViewOut", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, import("../dist/schema/index.js").MessageUnion<{
    readonly ReachedLimit: {};
}>, typeof assembleViewOutBlock>;
export declare const assembleViewlessOutBlock: () => import("../dist/block/definition.js").CompletedBlockWithOutMessage<import("../dist/block/owner.js").Owner<"ProducedViewlessOut", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, import("../dist/schema/index.js").MessageUnion<{
    readonly ClickedIncrement: {};
    readonly CompletedSaveCount: {};
}>, import("../dist/schema/index.js").MessageUnion<{
    readonly ReachedLimit: {};
}>, readonly [], readonly [], Readonly<{
    readonly init: () => {
        model: {
            readonly count: number;
        };
    };
    readonly update: NoInfer<{
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
    readonly EffectsLayer: Layer.Layer<never, never, never>;
}>>;
export declare const AssembledViewlessOutBlock: import("../dist/block/definition.js").CompletedBlockWithOutMessage<import("../dist/block/owner.js").Owner<"ProducedViewlessOut", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, import("../dist/schema/index.js").MessageUnion<{
    readonly ClickedIncrement: {};
    readonly CompletedSaveCount: {};
}>, import("../dist/schema/index.js").MessageUnion<{
    readonly ReachedLimit: {};
}>, readonly [], readonly [], Readonly<{
    readonly init: () => {
        model: {
            readonly count: number;
        };
    };
    readonly update: NoInfer<{
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
    readonly EffectsLayer: Layer.Layer<never, never, never>;
}>>;
export declare const ViewlessOutBlock: import("../dist/block/produced.js").ProducedBlockWithOutMessage<import("../dist/block/owner.js").Owner<"ProducedViewlessOut", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, import("../dist/schema/index.js").MessageUnion<{
    readonly ReachedLimit: {};
}>, typeof assembleViewlessOutBlock>;
export declare const assembleReplacedBlock: () => import("../dist/block/definition.js").Block<import("../dist/block/owner.js").Owner<"ProducedView", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, import("../dist/schema/index.js").MessageUnion<{
    readonly ClickedIncrement: {};
    readonly CompletedSaveCount: {};
}>, undefined, readonly [], readonly [], Readonly<{
    readonly EffectsLayer: Layer.Layer<never, never, never>;
    readonly init: () => {
        model: {
            readonly count: number;
        };
    };
    readonly update: NoInfer<{
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
    readonly view: import("../dist/block/definition.js").OwnedAuthoredView<import("../dist/html/block.js").BlockView<{
        readonly count: number;
    }, {
        readonly _tag: "ClickedIncrement";
    } | {
        readonly _tag: "CompletedSaveCount";
    }, void, never>, import("../dist/block/owner.js").Owner<"ProducedView", true>, {
        readonly count: number;
    }, {
        readonly _tag: "ClickedIncrement";
    } | {
        readonly _tag: "CompletedSaveCount";
    }, never>;
}>>;
export declare const AssembledReplacedBlock: import("../dist/block/definition.js").Block<import("../dist/block/owner.js").Owner<"ProducedView", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, import("../dist/schema/index.js").MessageUnion<{
    readonly ClickedIncrement: {};
    readonly CompletedSaveCount: {};
}>, undefined, readonly [], readonly [], Readonly<{
    readonly EffectsLayer: Layer.Layer<never, never, never>;
    readonly init: () => {
        model: {
            readonly count: number;
        };
    };
    readonly update: NoInfer<{
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
    readonly view: import("../dist/block/definition.js").OwnedAuthoredView<import("../dist/html/block.js").BlockView<{
        readonly count: number;
    }, {
        readonly _tag: "ClickedIncrement";
    } | {
        readonly _tag: "CompletedSaveCount";
    }, void, never>, import("../dist/block/owner.js").Owner<"ProducedView", true>, {
        readonly count: number;
    }, {
        readonly _tag: "ClickedIncrement";
    } | {
        readonly _tag: "CompletedSaveCount";
    }, never>;
}>>;
export declare const ReplacedBlock: import("../dist/block/produced.js").ProducedBlockWithView<import("../dist/block/owner.js").Owner<"ProducedView", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, typeof assembleReplacedBlock>;
export declare const assembleProvidedBlock: () => import("../dist/block/definition.js").Block<import("../dist/block/owner.js").Owner<"ProducedHost", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, import("../dist/schema/index.js").MessageUnion<{
    readonly ClickedIncrement: {};
    readonly CompletedSaveCount: {};
}>, undefined, readonly [], readonly [], Readonly<{
    EffectsLayer: Layer.Layer<import("../dist/command/public.js").Handler<"ProducedHost/SaveCount", {
        readonly count: number;
    }, {
        readonly _tag: "CompletedSaveCount";
    }>, never, never>;
    hostHandlers: readonly [];
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
        }, import("../dist/command/public.js").Handler<"ProducedHost/SaveCount", {
            readonly count: number;
        }, {
            readonly _tag: "CompletedSaveCount";
        }>>;
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
        }, import("../dist/command/public.js").Handler<"ProducedHost/SaveCount", {
            readonly count: number;
        }, {
            readonly _tag: "CompletedSaveCount";
        }>>;
    }>;
    view: import("../dist/block/definition.js").OwnedAuthoredView<import("../dist/html/block.js").BlockView<{
        readonly count: number;
    }, {
        readonly _tag: "ClickedIncrement";
    } | {
        readonly _tag: "CompletedSaveCount";
    }, void, never>, import("../dist/block/owner.js").Owner<"ProducedHost", true>, {
        readonly count: number;
    }, {
        readonly _tag: "ClickedIncrement";
    } | {
        readonly _tag: "CompletedSaveCount";
    }, never>;
}>>;
export declare const AssembledProvidedBlock: import("../dist/block/definition.js").Block<import("../dist/block/owner.js").Owner<"ProducedHost", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, import("../dist/schema/index.js").MessageUnion<{
    readonly ClickedIncrement: {};
    readonly CompletedSaveCount: {};
}>, undefined, readonly [], readonly [], Readonly<{
    EffectsLayer: Layer.Layer<import("../dist/command/public.js").Handler<"ProducedHost/SaveCount", {
        readonly count: number;
    }, {
        readonly _tag: "CompletedSaveCount";
    }>, never, never>;
    hostHandlers: readonly [];
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
        }, import("../dist/command/public.js").Handler<"ProducedHost/SaveCount", {
            readonly count: number;
        }, {
            readonly _tag: "CompletedSaveCount";
        }>>;
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
        }, import("../dist/command/public.js").Handler<"ProducedHost/SaveCount", {
            readonly count: number;
        }, {
            readonly _tag: "CompletedSaveCount";
        }>>;
    }>;
    view: import("../dist/block/definition.js").OwnedAuthoredView<import("../dist/html/block.js").BlockView<{
        readonly count: number;
    }, {
        readonly _tag: "ClickedIncrement";
    } | {
        readonly _tag: "CompletedSaveCount";
    }, void, never>, import("../dist/block/owner.js").Owner<"ProducedHost", true>, {
        readonly count: number;
    }, {
        readonly _tag: "ClickedIncrement";
    } | {
        readonly _tag: "CompletedSaveCount";
    }, never>;
}>>;
export declare const ProvidedBlock: import("../dist/block/produced.js").ProducedBlockWithView<import("../dist/block/owner.js").Owner<"ProducedHost", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, typeof assembleProvidedBlock>;
