import { Program } from 'foldkit';
import type { Block } from 'foldkit';
import { AssembledProvidedBlock, AssembledReplacedBlock, AssembledViewBlock, AssembledViewOutBlock, AssembledViewlessBlock, AssembledViewlessOutBlock, ProvidedBlock, ReplacedBlock, ViewBlock, ViewOutBlock, ViewlessBlock, ViewlessOutBlock } from './produced-block-block.js';
import { CounterOutMessage, Model } from './produced-block-definition.js';
import type { Assert, Equal, MembersEqual, ReasonOf } from './produced-block-equality.js';
import { AnyProducerBlock, AnyResultBlock, EnrichedBlock, ErasedBlock, ForeignBlock, MissingViewBlock, NeverBlock, NotFunctionBlock, ParameterBlock, SameIdBlock, UnexpectedViewBlock } from './produced-block-invalid.js';
export type ProducedKeys = [
    Assert<Equal<keyof typeof ViewBlock, keyof typeof AssembledViewBlock>>,
    Assert<Equal<keyof typeof ViewlessBlock, keyof typeof AssembledViewlessBlock>>,
    Assert<Equal<keyof typeof ViewOutBlock, keyof typeof AssembledViewOutBlock>>,
    Assert<Equal<keyof typeof ViewlessOutBlock, keyof typeof AssembledViewlessOutBlock>>,
    Assert<Equal<keyof typeof ReplacedBlock, keyof typeof AssembledReplacedBlock>>,
    Assert<Equal<keyof typeof ProvidedBlock, keyof typeof AssembledProvidedBlock>>
];
export type ProducedMembers = [
    Assert<MembersEqual<typeof AssembledViewBlock, typeof ViewBlock>>,
    Assert<MembersEqual<typeof AssembledViewlessBlock, typeof ViewlessBlock>>,
    Assert<MembersEqual<typeof AssembledViewOutBlock, typeof ViewOutBlock>>,
    Assert<MembersEqual<typeof AssembledViewlessOutBlock, typeof ViewlessOutBlock>>,
    Assert<MembersEqual<typeof AssembledReplacedBlock, typeof ReplacedBlock>>,
    Assert<MembersEqual<typeof AssembledProvidedBlock, typeof ProvidedBlock>>
];
export type DefinitionMembers = [
    Assert<Equal<typeof ViewBlock.Model, typeof Model>>,
    Assert<Equal<typeof ViewOutBlock.OutMessage, typeof CounterOutMessage>>,
    Assert<Equal<typeof ViewBlock.OutMessage, undefined>>,
    Assert<Equal<MembersEqual<{
        a: 1;
    }, {
        a: 2;
    }>, false>>
];
export declare const producedAsAnyBlock: ReadonlyArray<Block.AnyBlock>;
declare const ViewBinding: Block.BindingEvidence<Block.ProducedBlockWithView<Block.Owner<"ProducedView", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, typeof import("./produced-block-block.js").assembleViewBlock>, never, Readonly<{
    subscriptions: {};
    managedResources: {};
    mounts: readonly never[];
    EffectsLayer: import("effect/Layer").Layer<never, never, never>;
}>, false> & Block.BindingDeliveryEvidence<Readonly<{
    _tag: "GotChildMessage";
    placement: "child";
    generation: number;
    message: {
        readonly _tag: "CompletedSaveCount";
    } | {
        readonly _tag: "ClickedIncrement";
    };
}>, Readonly<{
    _tag: "GotChildMessage";
    placement: "child";
    generation: number;
    message: {
        readonly _tag: "CompletedSaveCount";
    } | {
        readonly _tag: "ClickedIncrement";
    };
}>, import("effect/Schema").Codec<Readonly<{
    _tag: "GotChildMessage";
    placement: "child";
    generation: number;
    message: {
        readonly _tag: "CompletedSaveCount";
    } | {
        readonly _tag: "ClickedIncrement";
    };
}>, Readonly<{
    _tag: "GotChildMessage";
    placement: "child";
    generation: number;
    message: {
        readonly _tag: "ClickedIncrement";
    } | {
        readonly _tag: "CompletedSaveCount";
    };
}>, never, never>> & Block.BindingPolicyEvidence<never> & Readonly<{
    placement: "child";
    init: Block.BindingInitializer<Block.ProducedBlockWithView<Block.Owner<"ProducedView", true>, import("effect/Schema").Struct<{
        readonly count: import("effect/Schema").Number;
    }>, typeof import("./produced-block-block.js").assembleViewBlock>, {
        readonly child: {
            readonly count: number;
        };
    }, Readonly<{
        _tag: "GotChildMessage";
        placement: "child";
        generation: number;
        message: {
            readonly _tag: "CompletedSaveCount";
        } | {
            readonly _tag: "ClickedIncrement";
        };
    }>, "child", never, false, import("../dist/schema/index.js").MessageUnion<{
        readonly ClickedParent: {};
    }>, import("effect/Schema").Codec<Readonly<{
        _tag: "GotChildMessage";
        placement: "child";
        generation: number;
        message: {
            readonly _tag: "CompletedSaveCount";
        } | {
            readonly _tag: "ClickedIncrement";
        };
    }>, Readonly<{
        _tag: "GotChildMessage";
        placement: "child";
        generation: number;
        message: {
            readonly _tag: "ClickedIncrement";
        } | {
            readonly _tag: "CompletedSaveCount";
        };
    }>, never, never>>;
    fold: (model: {
        readonly child: {
            readonly count: number;
        };
    } & import("../dist/update/update.js").GraphCapability<{
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
                    readonly _tag: "CompletedSaveCount";
                } | {
                    readonly _tag: "ClickedIncrement";
                };
            }>, Readonly<{
                _tag: "GotChildMessage";
                placement: "child";
                generation: number;
                message: {
                    readonly _tag: "ClickedIncrement";
                } | {
                    readonly _tag: "CompletedSaveCount";
                };
            }>, never, never>;
            block: Readonly<{
                owner: Block.Owner<"ProducedView", true>;
                mountRequirements: () => never;
            }>;
        }>;
    }>>, message: {
        readonly _tag: "CompletedSaveCount";
    } | {
        readonly _tag: "ClickedIncrement";
    }) => import("../dist/update/update.js").ResultRecipe<{
        readonly child: {
            readonly count: number;
        };
    }, Readonly<{
        _tag: "GotChildMessage";
        placement: "child";
        generation: number;
        message: {
            readonly _tag: "CompletedSaveCount";
        } | {
            readonly _tag: "ClickedIncrement";
        };
    }>, never, never, Readonly<{
        __blockBindingRequirement: Readonly<{
            placement: "child";
            generatedSchema: () => import("effect/Schema").Codec<Readonly<{
                _tag: "GotChildMessage";
                placement: "child";
                generation: number;
                message: {
                    readonly _tag: "CompletedSaveCount";
                } | {
                    readonly _tag: "ClickedIncrement";
                };
            }>, Readonly<{
                _tag: "GotChildMessage";
                placement: "child";
                generation: number;
                message: {
                    readonly _tag: "ClickedIncrement";
                } | {
                    readonly _tag: "CompletedSaveCount";
                };
            }>, never, never>;
            block: Readonly<{
                owner: Block.Owner<"ProducedView", true>;
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
                readonly _tag: "CompletedSaveCount";
            } | {
                readonly _tag: "ClickedIncrement";
            };
        }>>, "toParentMessage"> & Block.ValidateEmbeddedViewMounts<Block.ProducedBlockWithView<Block.Owner<"ProducedView", true>, import("effect/Schema").Struct<{
            readonly count: import("effect/Schema").Number;
        }>, typeof import("./produced-block-block.js").assembleViewBlock>, View> & ([Parameters<View>[0], {
            readonly count: number;
        }] extends [{
            readonly count: number;
        }, Parameters<View>[0]] ? [Parameters<Block.BoundBlockFields<View, Readonly<{
            _tag: "GotChildMessage";
            placement: "child";
            generation: number;
            message: {
                readonly _tag: "CompletedSaveCount";
            } | {
                readonly _tag: "ClickedIncrement";
            };
        }>>["toParentMessage"]>[0], {
            readonly _tag: "CompletedSaveCount";
        } | {
            readonly _tag: "ClickedIncrement";
        }] extends [{
            readonly _tag: "CompletedSaveCount";
        } | {
            readonly _tag: "ClickedIncrement";
        }, Parameters<Block.BoundBlockFields<View, Readonly<{
            _tag: "GotChildMessage";
            placement: "child";
            generation: number;
            message: {
                readonly _tag: "CompletedSaveCount";
            } | {
                readonly _tag: "ClickedIncrement";
            };
        }>>["toParentMessage"]>[0]] ? unknown : never : never)): Block.Config<Block.BoundBlockView<View, Readonly<{
            __blockBindingRequirement: Readonly<{
                placement: "child";
                generatedSchema: () => never;
                block: Readonly<{
                    owner: Block.Owner<"ProducedView", true>;
                    mountRequirements: () => never;
                }>;
            }>;
        }>>, Readonly<{
            _tag: "GotChildMessage";
            placement: "child";
            generation: number;
            message: {
                readonly _tag: "CompletedSaveCount";
            } | {
                readonly _tag: "ClickedIncrement";
            };
        }>>;
        (config: Omit<Block.BoundBlockFields<Block.OwnedAuthoredView<Block.View<{
            readonly count: number;
        }, {
            readonly _tag: "CompletedSaveCount";
        } | {
            readonly _tag: "ClickedIncrement";
        }, void, never>, Block.Owner<"ProducedView", true>, {
            readonly count: number;
        }, {
            readonly _tag: "CompletedSaveCount";
        } | {
            readonly _tag: "ClickedIncrement";
        }, never>, Readonly<{
            _tag: "GotChildMessage";
            placement: "child";
            generation: number;
            message: {
                readonly _tag: "CompletedSaveCount";
            } | {
                readonly _tag: "ClickedIncrement";
            };
        }>>, "toParentMessage" | "view"> & Readonly<{
            view?: Block.OwnedAuthoredView<Block.View<{
                readonly count: number;
            }, {
                readonly _tag: "CompletedSaveCount";
            } | {
                readonly _tag: "ClickedIncrement";
            }, void, never>, Block.Owner<"ProducedView", true>, {
                readonly count: number;
            }, {
                readonly _tag: "CompletedSaveCount";
            } | {
                readonly _tag: "ClickedIncrement";
            }, never>;
        }>): Block.Config<Block.BoundBlockView<Block.OwnedAuthoredView<Block.View<{
            readonly count: number;
        }, {
            readonly _tag: "CompletedSaveCount";
        } | {
            readonly _tag: "ClickedIncrement";
        }, void, never>, Block.Owner<"ProducedView", true>, {
            readonly count: number;
        }, {
            readonly _tag: "CompletedSaveCount";
        } | {
            readonly _tag: "ClickedIncrement";
        }, never>, Readonly<{
            __blockBindingRequirement: Readonly<{
                placement: "child";
                generatedSchema: () => never;
                block: Readonly<{
                    owner: Block.Owner<"ProducedView", true>;
                    mountRequirements: () => never;
                }>;
            }>;
        }>>, Readonly<{
            _tag: "GotChildMessage";
            placement: "child";
            generation: number;
            message: {
                readonly _tag: "CompletedSaveCount";
            } | {
                readonly _tag: "ClickedIncrement";
            };
        }>>;
    };
}> & Readonly<{}> & Block.ParentBindingContract<{
    readonly child: {
        readonly count: number;
    };
}, {
    readonly _tag: "ClickedParent";
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
                readonly _tag: "CompletedSaveCount";
            } | {
                readonly _tag: "ClickedIncrement";
            };
        }>, Readonly<{
            _tag: "GotChildMessage";
            placement: "child";
            generation: number;
            message: {
                readonly _tag: "ClickedIncrement";
            } | {
                readonly _tag: "CompletedSaveCount";
            };
        }>, never, never>;
        block: Readonly<{
            owner: Block.Owner<"ProducedView", true>;
            mountRequirements: () => never;
        }>;
    }>;
}>>;
declare const AssembledViewBinding: Block.BindingEvidence<Block.CompletedWithView<Block.Composition<Block.Owner<"ProducedView", true>, import("effect/Schema").Struct<{
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
            readonly _tag: "CompletedSaveCount";
        } | {
            readonly _tag: "ClickedIncrement";
        }): (model: {
            readonly count: number;
        }) => import("../dist/update/update.js").Return<{
            readonly count: number;
        }, {
            readonly _tag: "CompletedSaveCount";
        } | {
            readonly _tag: "ClickedIncrement";
        }, never>;
        (model: {
            readonly count: number;
        }, message: {
            readonly _tag: "CompletedSaveCount";
        } | {
            readonly _tag: "ClickedIncrement";
        }): import("../dist/update/update.js").Return<{
            readonly count: number;
        }, {
            readonly _tag: "CompletedSaveCount";
        } | {
            readonly _tag: "ClickedIncrement";
        }, never>;
    }>;
    view: Block.OwnedAuthoredView<Block.View<{
        readonly count: number;
    }, {
        readonly _tag: "CompletedSaveCount";
    } | {
        readonly _tag: "ClickedIncrement";
    }, void, never>, Block.Owner<"ProducedView", true>, {
        readonly count: number;
    }, {
        readonly _tag: "CompletedSaveCount";
    } | {
        readonly _tag: "ClickedIncrement";
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
        readonly _tag: "CompletedSaveCount";
    } | {
        readonly _tag: "ClickedIncrement";
    };
}>, Readonly<{
    _tag: "GotChildMessage";
    placement: "child";
    generation: number;
    message: {
        readonly _tag: "CompletedSaveCount";
    } | {
        readonly _tag: "ClickedIncrement";
    };
}>, import("effect/Schema").Codec<Readonly<{
    _tag: "GotChildMessage";
    placement: "child";
    generation: number;
    message: {
        readonly _tag: "CompletedSaveCount";
    } | {
        readonly _tag: "ClickedIncrement";
    };
}>, Readonly<{
    _tag: "GotChildMessage";
    placement: "child";
    generation: number;
    message: {
        readonly _tag: "ClickedIncrement";
    } | {
        readonly _tag: "CompletedSaveCount";
    };
}>, never, never>> & Block.BindingPolicyEvidence<never> & Readonly<{
    placement: "child";
    init: Block.BindingInitializer<Block.CompletedWithView<Block.Composition<Block.Owner<"ProducedView", true>, import("effect/Schema").Struct<{
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
                readonly _tag: "CompletedSaveCount";
            } | {
                readonly _tag: "ClickedIncrement";
            }): (model: {
                readonly count: number;
            }) => import("../dist/update/update.js").Return<{
                readonly count: number;
            }, {
                readonly _tag: "CompletedSaveCount";
            } | {
                readonly _tag: "ClickedIncrement";
            }, never>;
            (model: {
                readonly count: number;
            }, message: {
                readonly _tag: "CompletedSaveCount";
            } | {
                readonly _tag: "ClickedIncrement";
            }): import("../dist/update/update.js").Return<{
                readonly count: number;
            }, {
                readonly _tag: "CompletedSaveCount";
            } | {
                readonly _tag: "ClickedIncrement";
            }, never>;
        }>;
        view: Block.OwnedAuthoredView<Block.View<{
            readonly count: number;
        }, {
            readonly _tag: "CompletedSaveCount";
        } | {
            readonly _tag: "ClickedIncrement";
        }, void, never>, Block.Owner<"ProducedView", true>, {
            readonly count: number;
        }, {
            readonly _tag: "CompletedSaveCount";
        } | {
            readonly _tag: "ClickedIncrement";
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
            readonly _tag: "CompletedSaveCount";
        } | {
            readonly _tag: "ClickedIncrement";
        };
    }>, "child", never, false, import("../dist/schema/index.js").MessageUnion<{
        readonly ClickedParent: {};
    }>, import("effect/Schema").Codec<Readonly<{
        _tag: "GotChildMessage";
        placement: "child";
        generation: number;
        message: {
            readonly _tag: "CompletedSaveCount";
        } | {
            readonly _tag: "ClickedIncrement";
        };
    }>, Readonly<{
        _tag: "GotChildMessage";
        placement: "child";
        generation: number;
        message: {
            readonly _tag: "ClickedIncrement";
        } | {
            readonly _tag: "CompletedSaveCount";
        };
    }>, never, never>>;
    fold: (model: {
        readonly child: {
            readonly count: number;
        };
    } & import("../dist/update/update.js").GraphCapability<{
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
                    readonly _tag: "CompletedSaveCount";
                } | {
                    readonly _tag: "ClickedIncrement";
                };
            }>, Readonly<{
                _tag: "GotChildMessage";
                placement: "child";
                generation: number;
                message: {
                    readonly _tag: "ClickedIncrement";
                } | {
                    readonly _tag: "CompletedSaveCount";
                };
            }>, never, never>;
            block: Readonly<{
                owner: Block.Owner<"ProducedView", true>;
                mountRequirements: () => never;
            }>;
        }>;
    }>>, message: {
        readonly _tag: "CompletedSaveCount";
    } | {
        readonly _tag: "ClickedIncrement";
    }) => import("../dist/update/update.js").ResultRecipe<{
        readonly child: {
            readonly count: number;
        };
    }, Readonly<{
        _tag: "GotChildMessage";
        placement: "child";
        generation: number;
        message: {
            readonly _tag: "CompletedSaveCount";
        } | {
            readonly _tag: "ClickedIncrement";
        };
    }>, never, never, Readonly<{
        __blockBindingRequirement: Readonly<{
            placement: "child";
            generatedSchema: () => import("effect/Schema").Codec<Readonly<{
                _tag: "GotChildMessage";
                placement: "child";
                generation: number;
                message: {
                    readonly _tag: "CompletedSaveCount";
                } | {
                    readonly _tag: "ClickedIncrement";
                };
            }>, Readonly<{
                _tag: "GotChildMessage";
                placement: "child";
                generation: number;
                message: {
                    readonly _tag: "ClickedIncrement";
                } | {
                    readonly _tag: "CompletedSaveCount";
                };
            }>, never, never>;
            block: Readonly<{
                owner: Block.Owner<"ProducedView", true>;
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
                readonly _tag: "CompletedSaveCount";
            } | {
                readonly _tag: "ClickedIncrement";
            };
        }>>, "toParentMessage"> & Block.ValidateEmbeddedViewMounts<Block.CompletedWithView<Block.Composition<Block.Owner<"ProducedView", true>, import("effect/Schema").Struct<{
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
                    readonly _tag: "CompletedSaveCount";
                } | {
                    readonly _tag: "ClickedIncrement";
                }): (model: {
                    readonly count: number;
                }) => import("../dist/update/update.js").Return<{
                    readonly count: number;
                }, {
                    readonly _tag: "CompletedSaveCount";
                } | {
                    readonly _tag: "ClickedIncrement";
                }, never>;
                (model: {
                    readonly count: number;
                }, message: {
                    readonly _tag: "CompletedSaveCount";
                } | {
                    readonly _tag: "ClickedIncrement";
                }): import("../dist/update/update.js").Return<{
                    readonly count: number;
                }, {
                    readonly _tag: "CompletedSaveCount";
                } | {
                    readonly _tag: "ClickedIncrement";
                }, never>;
            }>;
            view: Block.OwnedAuthoredView<Block.View<{
                readonly count: number;
            }, {
                readonly _tag: "CompletedSaveCount";
            } | {
                readonly _tag: "ClickedIncrement";
            }, void, never>, Block.Owner<"ProducedView", true>, {
                readonly count: number;
            }, {
                readonly _tag: "CompletedSaveCount";
            } | {
                readonly _tag: "ClickedIncrement";
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
                readonly _tag: "CompletedSaveCount";
            } | {
                readonly _tag: "ClickedIncrement";
            };
        }>>["toParentMessage"]>[0], {
            readonly _tag: "CompletedSaveCount";
        } | {
            readonly _tag: "ClickedIncrement";
        }] extends [{
            readonly _tag: "CompletedSaveCount";
        } | {
            readonly _tag: "ClickedIncrement";
        }, Parameters<Block.BoundBlockFields<View, Readonly<{
            _tag: "GotChildMessage";
            placement: "child";
            generation: number;
            message: {
                readonly _tag: "CompletedSaveCount";
            } | {
                readonly _tag: "ClickedIncrement";
            };
        }>>["toParentMessage"]>[0]] ? unknown : never : never)): Block.Config<Block.BoundBlockView<View, Readonly<{
            __blockBindingRequirement: Readonly<{
                placement: "child";
                generatedSchema: () => never;
                block: Readonly<{
                    owner: Block.Owner<"ProducedView", true>;
                    mountRequirements: () => never;
                }>;
            }>;
        }>>, Readonly<{
            _tag: "GotChildMessage";
            placement: "child";
            generation: number;
            message: {
                readonly _tag: "CompletedSaveCount";
            } | {
                readonly _tag: "ClickedIncrement";
            };
        }>>;
        (config: Omit<Block.BoundBlockFields<Block.OwnedAuthoredView<Block.View<{
            readonly count: number;
        }, {
            readonly _tag: "CompletedSaveCount";
        } | {
            readonly _tag: "ClickedIncrement";
        }, void, never>, Block.Owner<"ProducedView", true>, {
            readonly count: number;
        }, {
            readonly _tag: "CompletedSaveCount";
        } | {
            readonly _tag: "ClickedIncrement";
        }, never>, Readonly<{
            _tag: "GotChildMessage";
            placement: "child";
            generation: number;
            message: {
                readonly _tag: "CompletedSaveCount";
            } | {
                readonly _tag: "ClickedIncrement";
            };
        }>>, "toParentMessage" | "view"> & Readonly<{
            view?: Block.OwnedAuthoredView<Block.View<{
                readonly count: number;
            }, {
                readonly _tag: "CompletedSaveCount";
            } | {
                readonly _tag: "ClickedIncrement";
            }, void, never>, Block.Owner<"ProducedView", true>, {
                readonly count: number;
            }, {
                readonly _tag: "CompletedSaveCount";
            } | {
                readonly _tag: "ClickedIncrement";
            }, never>;
        }>): Block.Config<Block.BoundBlockView<Block.OwnedAuthoredView<Block.View<{
            readonly count: number;
        }, {
            readonly _tag: "CompletedSaveCount";
        } | {
            readonly _tag: "ClickedIncrement";
        }, void, never>, Block.Owner<"ProducedView", true>, {
            readonly count: number;
        }, {
            readonly _tag: "CompletedSaveCount";
        } | {
            readonly _tag: "ClickedIncrement";
        }, never>, Readonly<{
            __blockBindingRequirement: Readonly<{
                placement: "child";
                generatedSchema: () => never;
                block: Readonly<{
                    owner: Block.Owner<"ProducedView", true>;
                    mountRequirements: () => never;
                }>;
            }>;
        }>>, Readonly<{
            _tag: "GotChildMessage";
            placement: "child";
            generation: number;
            message: {
                readonly _tag: "CompletedSaveCount";
            } | {
                readonly _tag: "ClickedIncrement";
            };
        }>>;
    };
}> & Readonly<{}> & Block.ParentBindingContract<{
    readonly child: {
        readonly count: number;
    };
}, {
    readonly _tag: "ClickedParent";
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
                readonly _tag: "CompletedSaveCount";
            } | {
                readonly _tag: "ClickedIncrement";
            };
        }>, Readonly<{
            _tag: "GotChildMessage";
            placement: "child";
            generation: number;
            message: {
                readonly _tag: "ClickedIncrement";
            } | {
                readonly _tag: "CompletedSaveCount";
            };
        }>, never, never>;
        block: Readonly<{
            owner: Block.Owner<"ProducedView", true>;
            mountRequirements: () => never;
        }>;
    }>;
}>>;
declare const ViewlessBinding: Block.BindingEvidence<Block.ProducedBlockWithoutViewOrOutMessage<Block.Owner<"ProducedViewless", true>, import("effect/Schema").Struct<{
    readonly count: import("effect/Schema").Number;
}>, typeof import("./produced-block-block.js").assembleViewlessBlock>, never, Readonly<{
    subscriptions: {};
    managedResources: {};
    mounts: readonly never[];
    EffectsLayer: import("effect/Layer").Layer<never, never, never>;
}>, false> & Block.BindingDeliveryEvidence<Readonly<{
    _tag: "GotChildMessage";
    placement: "child";
    generation: number;
    message: {
        readonly _tag: "CompletedSaveCount";
    } | {
        readonly _tag: "ClickedIncrement";
    };
}>, Readonly<{
    _tag: "GotChildMessage";
    placement: "child";
    generation: number;
    message: {
        readonly _tag: "CompletedSaveCount";
    } | {
        readonly _tag: "ClickedIncrement";
    };
}>, import("effect/Schema").Codec<Readonly<{
    _tag: "GotChildMessage";
    placement: "child";
    generation: number;
    message: {
        readonly _tag: "CompletedSaveCount";
    } | {
        readonly _tag: "ClickedIncrement";
    };
}>, Readonly<{
    _tag: "GotChildMessage";
    placement: "child";
    generation: number;
    message: {
        readonly _tag: "ClickedIncrement";
    } | {
        readonly _tag: "CompletedSaveCount";
    };
}>, never, never>> & Block.BindingPolicyEvidence<never> & Readonly<{
    placement: "child";
    init: Block.BindingInitializer<Block.ProducedBlockWithoutViewOrOutMessage<Block.Owner<"ProducedViewless", true>, import("effect/Schema").Struct<{
        readonly count: import("effect/Schema").Number;
    }>, typeof import("./produced-block-block.js").assembleViewlessBlock>, {
        readonly child: {
            readonly count: number;
        };
    }, Readonly<{
        _tag: "GotChildMessage";
        placement: "child";
        generation: number;
        message: {
            readonly _tag: "CompletedSaveCount";
        } | {
            readonly _tag: "ClickedIncrement";
        };
    }>, "child", never, false, import("../dist/schema/index.js").MessageUnion<{
        readonly ClickedParent: {};
    }>, import("effect/Schema").Codec<Readonly<{
        _tag: "GotChildMessage";
        placement: "child";
        generation: number;
        message: {
            readonly _tag: "CompletedSaveCount";
        } | {
            readonly _tag: "ClickedIncrement";
        };
    }>, Readonly<{
        _tag: "GotChildMessage";
        placement: "child";
        generation: number;
        message: {
            readonly _tag: "ClickedIncrement";
        } | {
            readonly _tag: "CompletedSaveCount";
        };
    }>, never, never>>;
    fold: (model: {
        readonly child: {
            readonly count: number;
        };
    } & import("../dist/update/update.js").GraphCapability<{
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
                    readonly _tag: "CompletedSaveCount";
                } | {
                    readonly _tag: "ClickedIncrement";
                };
            }>, Readonly<{
                _tag: "GotChildMessage";
                placement: "child";
                generation: number;
                message: {
                    readonly _tag: "ClickedIncrement";
                } | {
                    readonly _tag: "CompletedSaveCount";
                };
            }>, never, never>;
            block: Readonly<{
                owner: Block.Owner<"ProducedViewless", true>;
                mountRequirements: () => never;
            }>;
        }>;
    }>>, message: {
        readonly _tag: "CompletedSaveCount";
    } | {
        readonly _tag: "ClickedIncrement";
    }) => import("../dist/update/update.js").ResultRecipe<{
        readonly child: {
            readonly count: number;
        };
    }, Readonly<{
        _tag: "GotChildMessage";
        placement: "child";
        generation: number;
        message: {
            readonly _tag: "CompletedSaveCount";
        } | {
            readonly _tag: "ClickedIncrement";
        };
    }>, never, never, Readonly<{
        __blockBindingRequirement: Readonly<{
            placement: "child";
            generatedSchema: () => import("effect/Schema").Codec<Readonly<{
                _tag: "GotChildMessage";
                placement: "child";
                generation: number;
                message: {
                    readonly _tag: "CompletedSaveCount";
                } | {
                    readonly _tag: "ClickedIncrement";
                };
            }>, Readonly<{
                _tag: "GotChildMessage";
                placement: "child";
                generation: number;
                message: {
                    readonly _tag: "ClickedIncrement";
                } | {
                    readonly _tag: "CompletedSaveCount";
                };
            }>, never, never>;
            block: Readonly<{
                owner: Block.Owner<"ProducedViewless", true>;
                mountRequirements: () => never;
            }>;
        }>;
    }>>;
    embedView: <View extends Block.AnyBlockView>(config: Omit<Block.BoundBlockFields<View, Readonly<{
        _tag: "GotChildMessage";
        placement: "child";
        generation: number;
        message: {
            readonly _tag: "CompletedSaveCount";
        } | {
            readonly _tag: "ClickedIncrement";
        };
    }>>, "toParentMessage"> & Block.ValidateEmbeddedViewMounts<Block.ProducedBlockWithoutViewOrOutMessage<Block.Owner<"ProducedViewless", true>, import("effect/Schema").Struct<{
        readonly count: import("effect/Schema").Number;
    }>, typeof import("./produced-block-block.js").assembleViewlessBlock>, View> & ([Parameters<View>[0], {
        readonly count: number;
    }] extends [{
        readonly count: number;
    }, Parameters<View>[0]] ? [Parameters<Block.BoundBlockFields<View, Readonly<{
        _tag: "GotChildMessage";
        placement: "child";
        generation: number;
        message: {
            readonly _tag: "CompletedSaveCount";
        } | {
            readonly _tag: "ClickedIncrement";
        };
    }>>["toParentMessage"]>[0], {
        readonly _tag: "CompletedSaveCount";
    } | {
        readonly _tag: "ClickedIncrement";
    }] extends [{
        readonly _tag: "CompletedSaveCount";
    } | {
        readonly _tag: "ClickedIncrement";
    }, Parameters<Block.BoundBlockFields<View, Readonly<{
        _tag: "GotChildMessage";
        placement: "child";
        generation: number;
        message: {
            readonly _tag: "CompletedSaveCount";
        } | {
            readonly _tag: "ClickedIncrement";
        };
    }>>["toParentMessage"]>[0]] ? unknown : never : never)) => Block.Config<Block.BoundBlockView<View, Readonly<{
        __blockBindingRequirement: Readonly<{
            placement: "child";
            generatedSchema: () => never;
            block: Readonly<{
                owner: Block.Owner<"ProducedViewless", true>;
                mountRequirements: () => never;
            }>;
        }>;
    }>>, Readonly<{
        _tag: "GotChildMessage";
        placement: "child";
        generation: number;
        message: {
            readonly _tag: "CompletedSaveCount";
        } | {
            readonly _tag: "ClickedIncrement";
        };
    }>>;
}> & Readonly<{}> & Block.ParentBindingContract<{
    readonly child: {
        readonly count: number;
    };
}, {
    readonly _tag: "ClickedParent";
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
                readonly _tag: "CompletedSaveCount";
            } | {
                readonly _tag: "ClickedIncrement";
            };
        }>, Readonly<{
            _tag: "GotChildMessage";
            placement: "child";
            generation: number;
            message: {
                readonly _tag: "ClickedIncrement";
            } | {
                readonly _tag: "CompletedSaveCount";
            };
        }>, never, never>;
        block: Readonly<{
            owner: Block.Owner<"ProducedViewless", true>;
            mountRequirements: () => never;
        }>;
    }>;
}>>;
declare const AssembledViewlessBinding: Block.BindingEvidence<Block.CompletedBlockWithoutViewOrOutMessage<Block.Owner<"ProducedViewless", true>, import("effect/Schema").Struct<{
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
            readonly _tag: "CompletedSaveCount";
        } | {
            readonly _tag: "ClickedIncrement";
        }): (model: {
            readonly count: number;
        }) => import("../dist/update/update.js").Return<{
            readonly count: number;
        }, {
            readonly _tag: "CompletedSaveCount";
        } | {
            readonly _tag: "ClickedIncrement";
        }, never>;
        (model: {
            readonly count: number;
        }, message: {
            readonly _tag: "CompletedSaveCount";
        } | {
            readonly _tag: "ClickedIncrement";
        }): import("../dist/update/update.js").Return<{
            readonly count: number;
        }, {
            readonly _tag: "CompletedSaveCount";
        } | {
            readonly _tag: "ClickedIncrement";
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
        readonly _tag: "CompletedSaveCount";
    } | {
        readonly _tag: "ClickedIncrement";
    };
}>, Readonly<{
    _tag: "GotChildMessage";
    placement: "child";
    generation: number;
    message: {
        readonly _tag: "CompletedSaveCount";
    } | {
        readonly _tag: "ClickedIncrement";
    };
}>, import("effect/Schema").Codec<Readonly<{
    _tag: "GotChildMessage";
    placement: "child";
    generation: number;
    message: {
        readonly _tag: "CompletedSaveCount";
    } | {
        readonly _tag: "ClickedIncrement";
    };
}>, Readonly<{
    _tag: "GotChildMessage";
    placement: "child";
    generation: number;
    message: {
        readonly _tag: "ClickedIncrement";
    } | {
        readonly _tag: "CompletedSaveCount";
    };
}>, never, never>> & Block.BindingPolicyEvidence<never> & Readonly<{
    placement: "child";
    init: Block.BindingInitializer<Block.CompletedBlockWithoutViewOrOutMessage<Block.Owner<"ProducedViewless", true>, import("effect/Schema").Struct<{
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
                readonly _tag: "CompletedSaveCount";
            } | {
                readonly _tag: "ClickedIncrement";
            }): (model: {
                readonly count: number;
            }) => import("../dist/update/update.js").Return<{
                readonly count: number;
            }, {
                readonly _tag: "CompletedSaveCount";
            } | {
                readonly _tag: "ClickedIncrement";
            }, never>;
            (model: {
                readonly count: number;
            }, message: {
                readonly _tag: "CompletedSaveCount";
            } | {
                readonly _tag: "ClickedIncrement";
            }): import("../dist/update/update.js").Return<{
                readonly count: number;
            }, {
                readonly _tag: "CompletedSaveCount";
            } | {
                readonly _tag: "ClickedIncrement";
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
            readonly _tag: "CompletedSaveCount";
        } | {
            readonly _tag: "ClickedIncrement";
        };
    }>, "child", never, false, import("../dist/schema/index.js").MessageUnion<{
        readonly ClickedParent: {};
    }>, import("effect/Schema").Codec<Readonly<{
        _tag: "GotChildMessage";
        placement: "child";
        generation: number;
        message: {
            readonly _tag: "CompletedSaveCount";
        } | {
            readonly _tag: "ClickedIncrement";
        };
    }>, Readonly<{
        _tag: "GotChildMessage";
        placement: "child";
        generation: number;
        message: {
            readonly _tag: "ClickedIncrement";
        } | {
            readonly _tag: "CompletedSaveCount";
        };
    }>, never, never>>;
    fold: (model: {
        readonly child: {
            readonly count: number;
        };
    } & import("../dist/update/update.js").GraphCapability<{
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
                    readonly _tag: "CompletedSaveCount";
                } | {
                    readonly _tag: "ClickedIncrement";
                };
            }>, Readonly<{
                _tag: "GotChildMessage";
                placement: "child";
                generation: number;
                message: {
                    readonly _tag: "ClickedIncrement";
                } | {
                    readonly _tag: "CompletedSaveCount";
                };
            }>, never, never>;
            block: Readonly<{
                owner: Block.Owner<"ProducedViewless", true>;
                mountRequirements: () => never;
            }>;
        }>;
    }>>, message: {
        readonly _tag: "CompletedSaveCount";
    } | {
        readonly _tag: "ClickedIncrement";
    }) => import("../dist/update/update.js").ResultRecipe<{
        readonly child: {
            readonly count: number;
        };
    }, Readonly<{
        _tag: "GotChildMessage";
        placement: "child";
        generation: number;
        message: {
            readonly _tag: "CompletedSaveCount";
        } | {
            readonly _tag: "ClickedIncrement";
        };
    }>, never, never, Readonly<{
        __blockBindingRequirement: Readonly<{
            placement: "child";
            generatedSchema: () => import("effect/Schema").Codec<Readonly<{
                _tag: "GotChildMessage";
                placement: "child";
                generation: number;
                message: {
                    readonly _tag: "CompletedSaveCount";
                } | {
                    readonly _tag: "ClickedIncrement";
                };
            }>, Readonly<{
                _tag: "GotChildMessage";
                placement: "child";
                generation: number;
                message: {
                    readonly _tag: "ClickedIncrement";
                } | {
                    readonly _tag: "CompletedSaveCount";
                };
            }>, never, never>;
            block: Readonly<{
                owner: Block.Owner<"ProducedViewless", true>;
                mountRequirements: () => never;
            }>;
        }>;
    }>>;
    embedView: <View extends Block.AnyBlockView>(config: Omit<Block.BoundBlockFields<View, Readonly<{
        _tag: "GotChildMessage";
        placement: "child";
        generation: number;
        message: {
            readonly _tag: "CompletedSaveCount";
        } | {
            readonly _tag: "ClickedIncrement";
        };
    }>>, "toParentMessage"> & Block.ValidateEmbeddedViewMounts<Block.CompletedBlockWithoutViewOrOutMessage<Block.Owner<"ProducedViewless", true>, import("effect/Schema").Struct<{
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
                readonly _tag: "CompletedSaveCount";
            } | {
                readonly _tag: "ClickedIncrement";
            }): (model: {
                readonly count: number;
            }) => import("../dist/update/update.js").Return<{
                readonly count: number;
            }, {
                readonly _tag: "CompletedSaveCount";
            } | {
                readonly _tag: "ClickedIncrement";
            }, never>;
            (model: {
                readonly count: number;
            }, message: {
                readonly _tag: "CompletedSaveCount";
            } | {
                readonly _tag: "ClickedIncrement";
            }): import("../dist/update/update.js").Return<{
                readonly count: number;
            }, {
                readonly _tag: "CompletedSaveCount";
            } | {
                readonly _tag: "ClickedIncrement";
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
            readonly _tag: "CompletedSaveCount";
        } | {
            readonly _tag: "ClickedIncrement";
        };
    }>>["toParentMessage"]>[0], {
        readonly _tag: "CompletedSaveCount";
    } | {
        readonly _tag: "ClickedIncrement";
    }] extends [{
        readonly _tag: "CompletedSaveCount";
    } | {
        readonly _tag: "ClickedIncrement";
    }, Parameters<Block.BoundBlockFields<View, Readonly<{
        _tag: "GotChildMessage";
        placement: "child";
        generation: number;
        message: {
            readonly _tag: "CompletedSaveCount";
        } | {
            readonly _tag: "ClickedIncrement";
        };
    }>>["toParentMessage"]>[0]] ? unknown : never : never)) => Block.Config<Block.BoundBlockView<View, Readonly<{
        __blockBindingRequirement: Readonly<{
            placement: "child";
            generatedSchema: () => never;
            block: Readonly<{
                owner: Block.Owner<"ProducedViewless", true>;
                mountRequirements: () => never;
            }>;
        }>;
    }>>, Readonly<{
        _tag: "GotChildMessage";
        placement: "child";
        generation: number;
        message: {
            readonly _tag: "CompletedSaveCount";
        } | {
            readonly _tag: "ClickedIncrement";
        };
    }>>;
}> & Readonly<{}> & Block.ParentBindingContract<{
    readonly child: {
        readonly count: number;
    };
}, {
    readonly _tag: "ClickedParent";
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
                readonly _tag: "CompletedSaveCount";
            } | {
                readonly _tag: "ClickedIncrement";
            };
        }>, Readonly<{
            _tag: "GotChildMessage";
            placement: "child";
            generation: number;
            message: {
                readonly _tag: "ClickedIncrement";
            } | {
                readonly _tag: "CompletedSaveCount";
            };
        }>, never, never>;
        block: Readonly<{
            owner: Block.Owner<"ProducedViewless", true>;
            mountRequirements: () => never;
        }>;
    }>;
}>>;
export type ProducedBindings = [
    Assert<Equal<keyof typeof ViewBinding, keyof typeof AssembledViewBinding>>,
    Assert<Equal<typeof ViewBinding.embedView, typeof AssembledViewBinding.embedView>>,
    Assert<Equal<typeof ViewlessBinding.embedView, typeof AssembledViewlessBinding.embedView>>,
    Assert<Equal<typeof ViewBinding.embedView, typeof AssembledViewlessBinding.embedView> extends true ? false : true>
];
export declare const producedRoot: Program.Element<undefined, never, never, never>;
declare const assembledRoot: Program.Element<undefined, never, never, never>;
export type ProducedRoot = Assert<Equal<typeof producedRoot, typeof assembledRoot>>;
export type InvalidProducerReasons = [
    Assert<Equal<ReasonOf<typeof ForeignBlock.init>, 'Block producer must return a Block of this Definition'>>,
    Assert<Equal<ReasonOf<typeof SameIdBlock.init>, 'Block producer must return a Block of this Definition'>>,
    Assert<Equal<ReasonOf<typeof NeverBlock.init>, 'Block producer must be a function with no parameters'>>,
    Assert<Equal<ReasonOf<typeof ErasedBlock.init>, 'Block producer must return a completed Block'>>,
    Assert<Equal<ReasonOf<typeof NotFunctionBlock.init>, 'Block producer must be a function with no parameters'>>,
    Assert<Equal<ReasonOf<typeof ParameterBlock.init>, 'Block producer must be a function with no parameters'>>,
    Assert<Equal<ReasonOf<typeof AnyProducerBlock.init>, 'Block producer must be a function with no parameters'>>,
    Assert<Equal<ReasonOf<typeof AnyResultBlock.init>, 'Block producer must not return any'>>,
    Assert<Equal<ReasonOf<typeof EnrichedBlock.init>, 'Block producer must return the completed Block. Add members to the produced Block instead.'>>,
    Assert<Equal<ReasonOf<typeof MissingViewBlock.init>, 'produceBlock requires a Block with a default view. Use produceViewlessBlock.'>>,
    Assert<Equal<ReasonOf<typeof UnexpectedViewBlock.init>, 'produceViewlessBlock requires a Block without a default view. Use produceBlock.'>>
];
export {};
