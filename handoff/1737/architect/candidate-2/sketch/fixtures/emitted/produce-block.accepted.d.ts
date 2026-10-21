import { Program } from 'foldkit';
import type { Block } from 'foldkit';
import { HeadlessAssembled, HeadlessBlock, HeadlessOutAssembled, HeadlessOutBlock, ReplacedViewBlock, ViewAssembled, ViewBlock, ViewOutAssembled, ViewOutBlock, assembleTwin } from './produce-block-block.js';
import { ViewDefinition, ViewOutDefinition } from './produce-block-definition.js';
import type { Assert, Equal, MembersEqual } from './produce-block-equality.js';
import { Any, Erased, Foreign, HeadlessButView, Never, NotFunction, OutTwin, SameId, SameModel, ViewButHeadless, WithParameter } from './produce-block-invalid.js';
export type ViewKeys = Assert<Equal<keyof typeof ViewBlock, keyof typeof ViewAssembled>>;
export type ViewOutKeys = Assert<Equal<keyof typeof ViewOutBlock, keyof typeof ViewOutAssembled>>;
export type HeadlessKeys = Assert<Equal<keyof typeof HeadlessBlock, keyof typeof HeadlessAssembled>>;
export type HeadlessOutKeys = Assert<Equal<keyof typeof HeadlessOutBlock, keyof typeof HeadlessOutAssembled>>;
export type ViewMembers = Assert<MembersEqual<typeof ViewAssembled, typeof ViewBlock>>;
export type ViewOutMembers = Assert<MembersEqual<typeof ViewOutAssembled, typeof ViewOutBlock>>;
export type HeadlessMembers = Assert<MembersEqual<typeof HeadlessAssembled, typeof HeadlessBlock>>;
export type HeadlessOutMembers = Assert<MembersEqual<typeof HeadlessOutAssembled, typeof HeadlessOutBlock>>;
export type ChainedKeys = Assert<Equal<keyof typeof ReplacedViewBlock, keyof typeof ViewAssembled>>;
export type ModelFromDefinition = Assert<Equal<typeof ViewBlock.Model, typeof ViewDefinition.Model>>;
export type OutMessageFromDefinition = Assert<Equal<typeof ViewOutBlock.OutMessage, typeof ViewOutDefinition.OutMessage>>;
export type NoOutMessage = Assert<Equal<typeof ViewBlock.OutMessage, undefined>>;
export declare const acceptedAsAnyBlock: ReadonlyArray<Block.AnyBlock>;
declare const ViewBinding: Block.BindingEvidence<Block.ProducedBlockWithView<Block.Owner<"ProduceView", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, typeof import("./produce-block-block.js").assembleView>, never, Readonly<{
    subscriptions: {};
    managedResources: {};
    mounts: readonly never[];
    EffectsLayer: import("effect/Layer").Layer<never, never, never>;
}>, false> & Block.BindingDeliveryEvidence<Readonly<{
    _tag: "GotChildMessage";
    placement: "child";
    generation: number;
    message: {
        readonly _tag: "Clicked";
    };
}>, Readonly<{
    _tag: "GotChildMessage";
    placement: "child";
    generation: number;
    message: {
        readonly _tag: "Clicked";
    };
}>, import("effect/Schema").Codec<Readonly<{
    _tag: "GotChildMessage";
    placement: "child";
    generation: number;
    message: {
        readonly _tag: "Clicked";
    };
}>, Readonly<{
    _tag: "GotChildMessage";
    placement: "child";
    generation: number;
    message: {
        readonly _tag: "Clicked";
    };
}>, never, never>> & Block.BindingPolicyEvidence<never> & Readonly<{
    placement: "child";
    init: Block.BindingInitializer<Block.ProducedBlockWithView<Block.Owner<"ProduceView", true>, import("effect/Schema").Struct<{
        readonly count: import("effect/Schema").Number;
    }>, typeof import("./produce-block-block.js").assembleView>, {
        readonly child: {
            readonly count: number;
        };
    }, Readonly<{
        _tag: "GotChildMessage";
        placement: "child";
        generation: number;
        message: {
            readonly _tag: "Clicked";
        };
    }>, "child", never, false, import("foldkit/message").MessageUnion<{
        readonly Noted: {};
    }>, import("effect/Schema").Codec<Readonly<{
        _tag: "GotChildMessage";
        placement: "child";
        generation: number;
        message: {
            readonly _tag: "Clicked";
        };
    }>, Readonly<{
        _tag: "GotChildMessage";
        placement: "child";
        generation: number;
        message: {
            readonly _tag: "Clicked";
        };
    }>, never, never>>;
    fold: (model: {
        readonly child: {
            readonly count: number;
        };
    } & import("foldkit/update").GraphCapability<{
        readonly child: {
            readonly count: number;
        };
    }, Readonly<{
        __blockBindingRequirement: Readonly<{
            placement: "child";
            generatedSchema: () => import("effect/Schema").Codec<Readonly<{
                _tag: "GotChildMessage";
                placement: "child";
                generation: number;
                message: {
                    readonly _tag: "Clicked";
                };
            }>, Readonly<{
                _tag: "GotChildMessage";
                placement: "child";
                generation: number;
                message: {
                    readonly _tag: "Clicked";
                };
            }>, never, never>;
            block: Readonly<{
                owner: Block.Owner<"ProduceView", true>;
                mountRequirements: () => never;
            }>;
        }>;
    }>>, message: {
        readonly _tag: "Clicked";
    }) => import("foldkit/update").ResultRecipe<{
        readonly child: {
            readonly count: number;
        };
    }, Readonly<{
        _tag: "GotChildMessage";
        placement: "child";
        generation: number;
        message: {
            readonly _tag: "Clicked";
        };
    }>, never, never, Readonly<{
        __blockBindingRequirement: Readonly<{
            placement: "child";
            generatedSchema: () => import("effect/Schema").Codec<Readonly<{
                _tag: "GotChildMessage";
                placement: "child";
                generation: number;
                message: {
                    readonly _tag: "Clicked";
                };
            }>, Readonly<{
                _tag: "GotChildMessage";
                placement: "child";
                generation: number;
                message: {
                    readonly _tag: "Clicked";
                };
            }>, never, never>;
            block: Readonly<{
                owner: Block.Owner<"ProduceView", true>;
                mountRequirements: () => never;
            }>;
        }>;
    }>>;
    embedView: {
        <View extends Block.AnyBlockView>(config: Omit<Block.BoundBlockFields<View, Readonly<{
            _tag: "GotChildMessage";
            placement: "child";
            generation: number;
            message: {
                readonly _tag: "Clicked";
            };
        }>>, "toParentMessage"> & Block.ValidateEmbeddedViewMounts<Block.ProducedBlockWithView<Block.Owner<"ProduceView", true>, import("effect/Schema").Struct<{
            readonly count: import("effect/Schema").Number;
        }>, typeof import("./produce-block-block.js").assembleView>, View> & ([Parameters<View>[0], {
            readonly count: number;
        }] extends [{
            readonly count: number;
        }, Parameters<View>[0]] ? [Parameters<Block.BoundBlockFields<View, Readonly<{
            _tag: "GotChildMessage";
            placement: "child";
            generation: number;
            message: {
                readonly _tag: "Clicked";
            };
        }>>["toParentMessage"]>[0], {
            readonly _tag: "Clicked";
        }] extends [{
            readonly _tag: "Clicked";
        }, Parameters<Block.BoundBlockFields<View, Readonly<{
            _tag: "GotChildMessage";
            placement: "child";
            generation: number;
            message: {
                readonly _tag: "Clicked";
            };
        }>>["toParentMessage"]>[0]] ? unknown : never : never)): Block.Config<Block.BoundBlockView<View, Readonly<{
            __blockBindingRequirement: Readonly<{
                placement: "child";
                generatedSchema: () => never;
                block: Readonly<{
                    owner: Block.Owner<"ProduceView", true>;
                    mountRequirements: () => never;
                }>;
            }>;
        }>>, Readonly<{
            _tag: "GotChildMessage";
            placement: "child";
            generation: number;
            message: {
                readonly _tag: "Clicked";
            };
        }>>;
        (config: Omit<Block.BoundBlockFields<Block.OwnedAuthoredView<Block.View<{
            readonly count: number;
        }, {
            readonly _tag: "Clicked";
        }, void, never>, Block.Owner<"ProduceView", true>, {
            readonly count: number;
        }, {
            readonly _tag: "Clicked";
        }, never>, Readonly<{
            _tag: "GotChildMessage";
            placement: "child";
            generation: number;
            message: {
                readonly _tag: "Clicked";
            };
        }>>, "toParentMessage" | "view"> & Readonly<{
            view?: Block.OwnedAuthoredView<Block.View<{
                readonly count: number;
            }, {
                readonly _tag: "Clicked";
            }, void, never>, Block.Owner<"ProduceView", true>, {
                readonly count: number;
            }, {
                readonly _tag: "Clicked";
            }, never>;
        }>): Block.Config<Block.BoundBlockView<Block.OwnedAuthoredView<Block.View<{
            readonly count: number;
        }, {
            readonly _tag: "Clicked";
        }, void, never>, Block.Owner<"ProduceView", true>, {
            readonly count: number;
        }, {
            readonly _tag: "Clicked";
        }, never>, Readonly<{
            __blockBindingRequirement: Readonly<{
                placement: "child";
                generatedSchema: () => never;
                block: Readonly<{
                    owner: Block.Owner<"ProduceView", true>;
                    mountRequirements: () => never;
                }>;
            }>;
        }>>, Readonly<{
            _tag: "GotChildMessage";
            placement: "child";
            generation: number;
            message: {
                readonly _tag: "Clicked";
            };
        }>>;
    };
}> & Readonly<{}> & Block.ParentBindingContract<{
    readonly child: {
        readonly count: number;
    };
}, {
    readonly _tag: "Noted";
}, never> & Block.InitialBindingEvidence<"child", {
    readonly count: number;
}, never, never, Readonly<{
    __blockBindingRequirement: Readonly<{
        placement: "child";
        generatedSchema: () => import("effect/Schema").Codec<Readonly<{
            _tag: "GotChildMessage";
            placement: "child";
            generation: number;
            message: {
                readonly _tag: "Clicked";
            };
        }>, Readonly<{
            _tag: "GotChildMessage";
            placement: "child";
            generation: number;
            message: {
                readonly _tag: "Clicked";
            };
        }>, never, never>;
        block: Readonly<{
            owner: Block.Owner<"ProduceView", true>;
            mountRequirements: () => never;
        }>;
    }>;
}>>;
declare const HeadlessBinding: Block.BindingEvidence<Block.ProducedBlockWithoutViewOrOutMessage<Block.Owner<"ProduceHeadless", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, typeof import("./produce-block-block.js").assembleHeadless>, never, Readonly<{
    subscriptions: {};
    managedResources: {};
    mounts: readonly never[];
    EffectsLayer: import("effect/Layer").Layer<never, never, never>;
}>, false> & Block.BindingDeliveryEvidence<Readonly<{
    _tag: "GotChildMessage";
    placement: "child";
    generation: number;
    message: {
        readonly _tag: "Clicked";
    };
}>, Readonly<{
    _tag: "GotChildMessage";
    placement: "child";
    generation: number;
    message: {
        readonly _tag: "Clicked";
    };
}>, import("effect/Schema").Codec<Readonly<{
    _tag: "GotChildMessage";
    placement: "child";
    generation: number;
    message: {
        readonly _tag: "Clicked";
    };
}>, Readonly<{
    _tag: "GotChildMessage";
    placement: "child";
    generation: number;
    message: {
        readonly _tag: "Clicked";
    };
}>, never, never>> & Block.BindingPolicyEvidence<never> & Readonly<{
    placement: "child";
    init: Block.BindingInitializer<Block.ProducedBlockWithoutViewOrOutMessage<Block.Owner<"ProduceHeadless", true>, import("effect/Schema").Struct<{
        readonly count: import("effect/Schema").Number;
    }>, typeof import("./produce-block-block.js").assembleHeadless>, {
        readonly child: {
            readonly count: number;
        };
    }, Readonly<{
        _tag: "GotChildMessage";
        placement: "child";
        generation: number;
        message: {
            readonly _tag: "Clicked";
        };
    }>, "child", never, false, import("foldkit/message").MessageUnion<{
        readonly Noted: {};
    }>, import("effect/Schema").Codec<Readonly<{
        _tag: "GotChildMessage";
        placement: "child";
        generation: number;
        message: {
            readonly _tag: "Clicked";
        };
    }>, Readonly<{
        _tag: "GotChildMessage";
        placement: "child";
        generation: number;
        message: {
            readonly _tag: "Clicked";
        };
    }>, never, never>>;
    fold: (model: {
        readonly child: {
            readonly count: number;
        };
    } & import("foldkit/update").GraphCapability<{
        readonly child: {
            readonly count: number;
        };
    }, Readonly<{
        __blockBindingRequirement: Readonly<{
            placement: "child";
            generatedSchema: () => import("effect/Schema").Codec<Readonly<{
                _tag: "GotChildMessage";
                placement: "child";
                generation: number;
                message: {
                    readonly _tag: "Clicked";
                };
            }>, Readonly<{
                _tag: "GotChildMessage";
                placement: "child";
                generation: number;
                message: {
                    readonly _tag: "Clicked";
                };
            }>, never, never>;
            block: Readonly<{
                owner: Block.Owner<"ProduceHeadless", true>;
                mountRequirements: () => never;
            }>;
        }>;
    }>>, message: {
        readonly _tag: "Clicked";
    }) => import("foldkit/update").ResultRecipe<{
        readonly child: {
            readonly count: number;
        };
    }, Readonly<{
        _tag: "GotChildMessage";
        placement: "child";
        generation: number;
        message: {
            readonly _tag: "Clicked";
        };
    }>, never, never, Readonly<{
        __blockBindingRequirement: Readonly<{
            placement: "child";
            generatedSchema: () => import("effect/Schema").Codec<Readonly<{
                _tag: "GotChildMessage";
                placement: "child";
                generation: number;
                message: {
                    readonly _tag: "Clicked";
                };
            }>, Readonly<{
                _tag: "GotChildMessage";
                placement: "child";
                generation: number;
                message: {
                    readonly _tag: "Clicked";
                };
            }>, never, never>;
            block: Readonly<{
                owner: Block.Owner<"ProduceHeadless", true>;
                mountRequirements: () => never;
            }>;
        }>;
    }>>;
    embedView: <View extends Block.AnyBlockView>(config: Omit<Block.BoundBlockFields<View, Readonly<{
        _tag: "GotChildMessage";
        placement: "child";
        generation: number;
        message: {
            readonly _tag: "Clicked";
        };
    }>>, "toParentMessage"> & Block.ValidateEmbeddedViewMounts<Block.ProducedBlockWithoutViewOrOutMessage<Block.Owner<"ProduceHeadless", true>, import("effect/Schema").Struct<{
        readonly count: import("effect/Schema").Number;
    }>, typeof import("./produce-block-block.js").assembleHeadless>, View> & ([Parameters<View>[0], {
        readonly count: number;
    }] extends [{
        readonly count: number;
    }, Parameters<View>[0]] ? [Parameters<Block.BoundBlockFields<View, Readonly<{
        _tag: "GotChildMessage";
        placement: "child";
        generation: number;
        message: {
            readonly _tag: "Clicked";
        };
    }>>["toParentMessage"]>[0], {
        readonly _tag: "Clicked";
    }] extends [{
        readonly _tag: "Clicked";
    }, Parameters<Block.BoundBlockFields<View, Readonly<{
        _tag: "GotChildMessage";
        placement: "child";
        generation: number;
        message: {
            readonly _tag: "Clicked";
        };
    }>>["toParentMessage"]>[0]] ? unknown : never : never)) => Block.Config<Block.BoundBlockView<View, Readonly<{
        __blockBindingRequirement: Readonly<{
            placement: "child";
            generatedSchema: () => never;
            block: Readonly<{
                owner: Block.Owner<"ProduceHeadless", true>;
                mountRequirements: () => never;
            }>;
        }>;
    }>>, Readonly<{
        _tag: "GotChildMessage";
        placement: "child";
        generation: number;
        message: {
            readonly _tag: "Clicked";
        };
    }>>;
}> & Readonly<{}> & Block.ParentBindingContract<{
    readonly child: {
        readonly count: number;
    };
}, {
    readonly _tag: "Noted";
}, never> & Block.InitialBindingEvidence<"child", {
    readonly count: number;
}, never, never, Readonly<{
    __blockBindingRequirement: Readonly<{
        placement: "child";
        generatedSchema: () => import("effect/Schema").Codec<Readonly<{
            _tag: "GotChildMessage";
            placement: "child";
            generation: number;
            message: {
                readonly _tag: "Clicked";
            };
        }>, Readonly<{
            _tag: "GotChildMessage";
            placement: "child";
            generation: number;
            message: {
                readonly _tag: "Clicked";
            };
        }>, never, never>;
        block: Readonly<{
            owner: Block.Owner<"ProduceHeadless", true>;
            mountRequirements: () => never;
        }>;
    }>;
}>>;
declare const AssembledViewBinding: Block.BindingEvidence<Block.CompletedWithView<Block.Composition<Block.Owner<"ProduceView", true>, import("effect/Schema").Struct<{
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
}>>, never, Readonly<{
    subscriptions: {};
    managedResources: {};
    mounts: readonly never[];
    EffectsLayer: import("effect/Layer").Layer<never, never, never>;
}>, false> & Block.BindingDeliveryEvidence<Readonly<{
    _tag: "GotChildMessage";
    placement: "child";
    generation: number;
    message: {
        readonly _tag: "Clicked";
    };
}>, Readonly<{
    _tag: "GotChildMessage";
    placement: "child";
    generation: number;
    message: {
        readonly _tag: "Clicked";
    };
}>, import("effect/Schema").Codec<Readonly<{
    _tag: "GotChildMessage";
    placement: "child";
    generation: number;
    message: {
        readonly _tag: "Clicked";
    };
}>, Readonly<{
    _tag: "GotChildMessage";
    placement: "child";
    generation: number;
    message: {
        readonly _tag: "Clicked";
    };
}>, never, never>> & Block.BindingPolicyEvidence<never> & Readonly<{
    placement: "child";
    init: Block.BindingInitializer<Block.CompletedWithView<Block.Composition<Block.Owner<"ProduceView", true>, import("effect/Schema").Struct<{
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
    }>>, {
        readonly child: {
            readonly count: number;
        };
    }, Readonly<{
        _tag: "GotChildMessage";
        placement: "child";
        generation: number;
        message: {
            readonly _tag: "Clicked";
        };
    }>, "child", never, false, import("foldkit/message").MessageUnion<{
        readonly Noted: {};
    }>, import("effect/Schema").Codec<Readonly<{
        _tag: "GotChildMessage";
        placement: "child";
        generation: number;
        message: {
            readonly _tag: "Clicked";
        };
    }>, Readonly<{
        _tag: "GotChildMessage";
        placement: "child";
        generation: number;
        message: {
            readonly _tag: "Clicked";
        };
    }>, never, never>>;
    fold: (model: {
        readonly child: {
            readonly count: number;
        };
    } & import("foldkit/update").GraphCapability<{
        readonly child: {
            readonly count: number;
        };
    }, Readonly<{
        __blockBindingRequirement: Readonly<{
            placement: "child";
            generatedSchema: () => import("effect/Schema").Codec<Readonly<{
                _tag: "GotChildMessage";
                placement: "child";
                generation: number;
                message: {
                    readonly _tag: "Clicked";
                };
            }>, Readonly<{
                _tag: "GotChildMessage";
                placement: "child";
                generation: number;
                message: {
                    readonly _tag: "Clicked";
                };
            }>, never, never>;
            block: Readonly<{
                owner: Block.Owner<"ProduceView", true>;
                mountRequirements: () => never;
            }>;
        }>;
    }>>, message: {
        readonly _tag: "Clicked";
    }) => import("foldkit/update").ResultRecipe<{
        readonly child: {
            readonly count: number;
        };
    }, Readonly<{
        _tag: "GotChildMessage";
        placement: "child";
        generation: number;
        message: {
            readonly _tag: "Clicked";
        };
    }>, never, never, Readonly<{
        __blockBindingRequirement: Readonly<{
            placement: "child";
            generatedSchema: () => import("effect/Schema").Codec<Readonly<{
                _tag: "GotChildMessage";
                placement: "child";
                generation: number;
                message: {
                    readonly _tag: "Clicked";
                };
            }>, Readonly<{
                _tag: "GotChildMessage";
                placement: "child";
                generation: number;
                message: {
                    readonly _tag: "Clicked";
                };
            }>, never, never>;
            block: Readonly<{
                owner: Block.Owner<"ProduceView", true>;
                mountRequirements: () => never;
            }>;
        }>;
    }>>;
    embedView: {
        <View extends Block.AnyBlockView>(config: Omit<Block.BoundBlockFields<View, Readonly<{
            _tag: "GotChildMessage";
            placement: "child";
            generation: number;
            message: {
                readonly _tag: "Clicked";
            };
        }>>, "toParentMessage"> & Block.ValidateEmbeddedViewMounts<Block.CompletedWithView<Block.Composition<Block.Owner<"ProduceView", true>, import("effect/Schema").Struct<{
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
        }>>, View> & ([Parameters<View>[0], {
            readonly count: number;
        }] extends [{
            readonly count: number;
        }, Parameters<View>[0]] ? [Parameters<Block.BoundBlockFields<View, Readonly<{
            _tag: "GotChildMessage";
            placement: "child";
            generation: number;
            message: {
                readonly _tag: "Clicked";
            };
        }>>["toParentMessage"]>[0], {
            readonly _tag: "Clicked";
        }] extends [{
            readonly _tag: "Clicked";
        }, Parameters<Block.BoundBlockFields<View, Readonly<{
            _tag: "GotChildMessage";
            placement: "child";
            generation: number;
            message: {
                readonly _tag: "Clicked";
            };
        }>>["toParentMessage"]>[0]] ? unknown : never : never)): Block.Config<Block.BoundBlockView<View, Readonly<{
            __blockBindingRequirement: Readonly<{
                placement: "child";
                generatedSchema: () => never;
                block: Readonly<{
                    owner: Block.Owner<"ProduceView", true>;
                    mountRequirements: () => never;
                }>;
            }>;
        }>>, Readonly<{
            _tag: "GotChildMessage";
            placement: "child";
            generation: number;
            message: {
                readonly _tag: "Clicked";
            };
        }>>;
        (config: Omit<Block.BoundBlockFields<Block.OwnedAuthoredView<Block.View<{
            readonly count: number;
        }, {
            readonly _tag: "Clicked";
        }, void, never>, Block.Owner<"ProduceView", true>, {
            readonly count: number;
        }, {
            readonly _tag: "Clicked";
        }, never>, Readonly<{
            _tag: "GotChildMessage";
            placement: "child";
            generation: number;
            message: {
                readonly _tag: "Clicked";
            };
        }>>, "toParentMessage" | "view"> & Readonly<{
            view?: Block.OwnedAuthoredView<Block.View<{
                readonly count: number;
            }, {
                readonly _tag: "Clicked";
            }, void, never>, Block.Owner<"ProduceView", true>, {
                readonly count: number;
            }, {
                readonly _tag: "Clicked";
            }, never>;
        }>): Block.Config<Block.BoundBlockView<Block.OwnedAuthoredView<Block.View<{
            readonly count: number;
        }, {
            readonly _tag: "Clicked";
        }, void, never>, Block.Owner<"ProduceView", true>, {
            readonly count: number;
        }, {
            readonly _tag: "Clicked";
        }, never>, Readonly<{
            __blockBindingRequirement: Readonly<{
                placement: "child";
                generatedSchema: () => never;
                block: Readonly<{
                    owner: Block.Owner<"ProduceView", true>;
                    mountRequirements: () => never;
                }>;
            }>;
        }>>, Readonly<{
            _tag: "GotChildMessage";
            placement: "child";
            generation: number;
            message: {
                readonly _tag: "Clicked";
            };
        }>>;
    };
}> & Readonly<{}> & Block.ParentBindingContract<{
    readonly child: {
        readonly count: number;
    };
}, {
    readonly _tag: "Noted";
}, never> & Block.InitialBindingEvidence<"child", {
    readonly count: number;
}, never, never, Readonly<{
    __blockBindingRequirement: Readonly<{
        placement: "child";
        generatedSchema: () => import("effect/Schema").Codec<Readonly<{
            _tag: "GotChildMessage";
            placement: "child";
            generation: number;
            message: {
                readonly _tag: "Clicked";
            };
        }>, Readonly<{
            _tag: "GotChildMessage";
            placement: "child";
            generation: number;
            message: {
                readonly _tag: "Clicked";
            };
        }>, never, never>;
        block: Readonly<{
            owner: Block.Owner<"ProduceView", true>;
            mountRequirements: () => never;
        }>;
    }>;
}>>;
declare const AssembledHeadlessBinding: Block.BindingEvidence<Block.CompletedBlockWithoutViewOrOutMessage<Block.Owner<"ProduceHeadless", true>, import("effect/Schema").Struct<{
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
    readonly EffectsLayer: import("effect/Layer").Layer<never, never, never>;
}>>, never, Readonly<{
    subscriptions: {};
    managedResources: {};
    mounts: readonly never[];
    EffectsLayer: import("effect/Layer").Layer<never, never, never>;
}>, false> & Block.BindingDeliveryEvidence<Readonly<{
    _tag: "GotChildMessage";
    placement: "child";
    generation: number;
    message: {
        readonly _tag: "Clicked";
    };
}>, Readonly<{
    _tag: "GotChildMessage";
    placement: "child";
    generation: number;
    message: {
        readonly _tag: "Clicked";
    };
}>, import("effect/Schema").Codec<Readonly<{
    _tag: "GotChildMessage";
    placement: "child";
    generation: number;
    message: {
        readonly _tag: "Clicked";
    };
}>, Readonly<{
    _tag: "GotChildMessage";
    placement: "child";
    generation: number;
    message: {
        readonly _tag: "Clicked";
    };
}>, never, never>> & Block.BindingPolicyEvidence<never> & Readonly<{
    placement: "child";
    init: Block.BindingInitializer<Block.CompletedBlockWithoutViewOrOutMessage<Block.Owner<"ProduceHeadless", true>, import("effect/Schema").Struct<{
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
        readonly EffectsLayer: import("effect/Layer").Layer<never, never, never>;
    }>>, {
        readonly child: {
            readonly count: number;
        };
    }, Readonly<{
        _tag: "GotChildMessage";
        placement: "child";
        generation: number;
        message: {
            readonly _tag: "Clicked";
        };
    }>, "child", never, false, import("foldkit/message").MessageUnion<{
        readonly Noted: {};
    }>, import("effect/Schema").Codec<Readonly<{
        _tag: "GotChildMessage";
        placement: "child";
        generation: number;
        message: {
            readonly _tag: "Clicked";
        };
    }>, Readonly<{
        _tag: "GotChildMessage";
        placement: "child";
        generation: number;
        message: {
            readonly _tag: "Clicked";
        };
    }>, never, never>>;
    fold: (model: {
        readonly child: {
            readonly count: number;
        };
    } & import("foldkit/update").GraphCapability<{
        readonly child: {
            readonly count: number;
        };
    }, Readonly<{
        __blockBindingRequirement: Readonly<{
            placement: "child";
            generatedSchema: () => import("effect/Schema").Codec<Readonly<{
                _tag: "GotChildMessage";
                placement: "child";
                generation: number;
                message: {
                    readonly _tag: "Clicked";
                };
            }>, Readonly<{
                _tag: "GotChildMessage";
                placement: "child";
                generation: number;
                message: {
                    readonly _tag: "Clicked";
                };
            }>, never, never>;
            block: Readonly<{
                owner: Block.Owner<"ProduceHeadless", true>;
                mountRequirements: () => never;
            }>;
        }>;
    }>>, message: {
        readonly _tag: "Clicked";
    }) => import("foldkit/update").ResultRecipe<{
        readonly child: {
            readonly count: number;
        };
    }, Readonly<{
        _tag: "GotChildMessage";
        placement: "child";
        generation: number;
        message: {
            readonly _tag: "Clicked";
        };
    }>, never, never, Readonly<{
        __blockBindingRequirement: Readonly<{
            placement: "child";
            generatedSchema: () => import("effect/Schema").Codec<Readonly<{
                _tag: "GotChildMessage";
                placement: "child";
                generation: number;
                message: {
                    readonly _tag: "Clicked";
                };
            }>, Readonly<{
                _tag: "GotChildMessage";
                placement: "child";
                generation: number;
                message: {
                    readonly _tag: "Clicked";
                };
            }>, never, never>;
            block: Readonly<{
                owner: Block.Owner<"ProduceHeadless", true>;
                mountRequirements: () => never;
            }>;
        }>;
    }>>;
    embedView: <View extends Block.AnyBlockView>(config: Omit<Block.BoundBlockFields<View, Readonly<{
        _tag: "GotChildMessage";
        placement: "child";
        generation: number;
        message: {
            readonly _tag: "Clicked";
        };
    }>>, "toParentMessage"> & Block.ValidateEmbeddedViewMounts<Block.CompletedBlockWithoutViewOrOutMessage<Block.Owner<"ProduceHeadless", true>, import("effect/Schema").Struct<{
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
        readonly EffectsLayer: import("effect/Layer").Layer<never, never, never>;
    }>>, View> & ([Parameters<View>[0], {
        readonly count: number;
    }] extends [{
        readonly count: number;
    }, Parameters<View>[0]] ? [Parameters<Block.BoundBlockFields<View, Readonly<{
        _tag: "GotChildMessage";
        placement: "child";
        generation: number;
        message: {
            readonly _tag: "Clicked";
        };
    }>>["toParentMessage"]>[0], {
        readonly _tag: "Clicked";
    }] extends [{
        readonly _tag: "Clicked";
    }, Parameters<Block.BoundBlockFields<View, Readonly<{
        _tag: "GotChildMessage";
        placement: "child";
        generation: number;
        message: {
            readonly _tag: "Clicked";
        };
    }>>["toParentMessage"]>[0]] ? unknown : never : never)) => Block.Config<Block.BoundBlockView<View, Readonly<{
        __blockBindingRequirement: Readonly<{
            placement: "child";
            generatedSchema: () => never;
            block: Readonly<{
                owner: Block.Owner<"ProduceHeadless", true>;
                mountRequirements: () => never;
            }>;
        }>;
    }>>, Readonly<{
        _tag: "GotChildMessage";
        placement: "child";
        generation: number;
        message: {
            readonly _tag: "Clicked";
        };
    }>>;
}> & Readonly<{}> & Block.ParentBindingContract<{
    readonly child: {
        readonly count: number;
    };
}, {
    readonly _tag: "Noted";
}, never> & Block.InitialBindingEvidence<"child", {
    readonly count: number;
}, never, never, Readonly<{
    __blockBindingRequirement: Readonly<{
        placement: "child";
        generatedSchema: () => import("effect/Schema").Codec<Readonly<{
            _tag: "GotChildMessage";
            placement: "child";
            generation: number;
            message: {
                readonly _tag: "Clicked";
            };
        }>, Readonly<{
            _tag: "GotChildMessage";
            placement: "child";
            generation: number;
            message: {
                readonly _tag: "Clicked";
            };
        }>, never, never>;
        block: Readonly<{
            owner: Block.Owner<"ProduceHeadless", true>;
            mountRequirements: () => never;
        }>;
    }>;
}>>;
export type EmbedViewOverloads = Assert<Equal<typeof ViewBinding.embedView, typeof AssembledViewBinding.embedView>>;
export type HeadlessEmbedViewOverloads = Assert<Equal<typeof HeadlessBinding.embedView, typeof AssembledHeadlessBinding.embedView>>;
export declare const viewRoot: Program.Element<undefined, never, never, never>;
declare const assembledRoot: Program.Element<undefined, never, never, never>;
export type RootMatchesAssembled = Assert<Equal<typeof viewRoot, typeof assembledRoot>>;
export declare const TwinBlock: Block.ProducedBlockWithView<Block.Owner<"ProduceView", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, typeof assembleTwin>;
type Reason<Produced> = keyof Produced[keyof Produced & 'update'];
export type ForeignReason = Assert<Equal<Reason<typeof Foreign>, 'The producer returned a Block from a different Definition.'>>;
export type SameModelReason = Assert<Equal<Reason<typeof SameModel>, 'The producer returned a Block from a different Definition.'>>;
export type SameIdReason = Assert<Equal<Reason<typeof SameId>, 'The producer returned a Block with a different Model than this Definition.'>>;
export type OutTwinReason = Assert<Equal<Reason<typeof OutTwin>, 'The producer returned a Block whose OutMessage differs from this Definition.'>>;
export type NeverReason = Assert<Equal<Reason<typeof Never>, 'The producer must be a function that takes no arguments.'>>;
export type NotFunctionReason = Assert<Equal<Reason<typeof NotFunction>, 'The producer must be a function that takes no arguments.'>>;
export type ParameterReason = Assert<Equal<Reason<typeof WithParameter>, 'The producer must be a function that takes no arguments.'>>;
export type AnyReason = Assert<Equal<Reason<typeof Any>, 'The producer returned any. Return the Block that assembleBlock completes.'>>;
export type ErasedReason = Assert<Equal<Reason<typeof Erased>, 'The producer returned never. Return the Block that assembleBlock completes.'>>;
export type ViewButHeadlessReason = Assert<Equal<Reason<typeof ViewButHeadless>, 'produceBlock needs a Block with a default view. Use produceHeadlessBlock for a Block without one.'>>;
export type HeadlessButViewReason = Assert<Equal<Reason<typeof HeadlessButView>, 'produceHeadlessBlock needs a Block without a default view. Use produceBlock for a Block with one.'>>;
export {};
