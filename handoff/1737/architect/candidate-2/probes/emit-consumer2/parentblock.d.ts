import { Schema } from 'effect';
import { Block } from 'foldkit';
import * as Message from 'foldkit/message';
export declare const ParentDefinition: Block.AuthoringDefinition<"XParent", Schema.Struct<{
    readonly child: Schema.Struct<{
        readonly count: Schema.Number;
    }>;
}>, Message.MessageUnion<{
    readonly Noted: {};
}>, undefined, true, undefined>;
export declare const ChildBinding: Block.BindingEvidence<Block.ProducedBlockWithView<Block.Owner<"XChild", true>, Schema.Struct<{
    readonly count: Schema.Number;
}>, () => Block.CompletedWithView<Block.Composition<Block.Owner<"XChild", true>, Schema.Struct<{
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
}>>>, never, Readonly<{
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
}>, Schema.Codec<Readonly<{
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
    init: Block.BindingInitializer<Block.ProducedBlockWithView<Block.Owner<"XChild", true>, Schema.Struct<{
        readonly count: Schema.Number;
    }>, () => Block.CompletedWithView<Block.Composition<Block.Owner<"XChild", true>, Schema.Struct<{
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
    }>>>, {
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
    }>, "child", never, false, Message.MessageUnion<{
        readonly Noted: {};
    }>, Schema.Codec<Readonly<{
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
            generatedSchema: () => Schema.Codec<Readonly<{
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
                owner: Block.Owner<"XChild", true>;
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
            generatedSchema: () => Schema.Codec<Readonly<{
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
                owner: Block.Owner<"XChild", true>;
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
        }>>, "toParentMessage"> & Block.ValidateEmbeddedViewMounts<Block.ProducedBlockWithView<Block.Owner<"XChild", true>, Schema.Struct<{
            readonly count: Schema.Number;
        }>, () => Block.CompletedWithView<Block.Composition<Block.Owner<"XChild", true>, Schema.Struct<{
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
        }>>>, View> & ([Parameters<View>[0], {
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
                    owner: Block.Owner<"XChild", true>;
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
        }, void, never>, Block.Owner<"XChild", true>, {
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
            }, void, never>, Block.Owner<"XChild", true>, {
                readonly count: number;
            }, {
                readonly _tag: "Clicked";
            }, never>;
        }>): Block.Config<Block.BoundBlockView<Block.OwnedAuthoredView<Block.View<{
            readonly count: number;
        }, {
            readonly _tag: "Clicked";
        }, void, never>, Block.Owner<"XChild", true>, {
            readonly count: number;
        }, {
            readonly _tag: "Clicked";
        }, never>, Readonly<{
            __blockBindingRequirement: Readonly<{
                placement: "child";
                generatedSchema: () => never;
                block: Readonly<{
                    owner: Block.Owner<"XChild", true>;
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
        generatedSchema: () => Schema.Codec<Readonly<{
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
            owner: Block.Owner<"XChild", true>;
            mountRequirements: () => never;
        }>;
    }>;
}>>;
declare const assembleParent: () => Block.CompletedWithView<Block.Composition<Block.Owner<"XParent", true>, Schema.Struct<{
    readonly child: Schema.Struct<{
        readonly count: Schema.Number;
    }>;
}>, Message.MessageUnion<{
    readonly Noted: {};
}>, undefined, readonly [], readonly [Block.BindingEvidence<Block.ProducedBlockWithView<Block.Owner<"XChild", true>, Schema.Struct<{
    readonly count: Schema.Number;
}>, () => Block.CompletedWithView<Block.Composition<Block.Owner<"XChild", true>, Schema.Struct<{
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
}>>>, never, Readonly<{
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
}>, Schema.Codec<Readonly<{
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
    init: Block.BindingInitializer<Block.ProducedBlockWithView<Block.Owner<"XChild", true>, Schema.Struct<{
        readonly count: Schema.Number;
    }>, () => Block.CompletedWithView<Block.Composition<Block.Owner<"XChild", true>, Schema.Struct<{
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
    }>>>, {
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
    }>, "child", never, false, Message.MessageUnion<{
        readonly Noted: {};
    }>, Schema.Codec<Readonly<{
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
            generatedSchema: () => Schema.Codec<Readonly<{
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
                owner: Block.Owner<"XChild", true>;
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
            generatedSchema: () => Schema.Codec<Readonly<{
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
                owner: Block.Owner<"XChild", true>;
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
        }>>, "toParentMessage"> & Block.ValidateEmbeddedViewMounts<Block.ProducedBlockWithView<Block.Owner<"XChild", true>, Schema.Struct<{
            readonly count: Schema.Number;
        }>, () => Block.CompletedWithView<Block.Composition<Block.Owner<"XChild", true>, Schema.Struct<{
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
        }>>>, View> & ([Parameters<View>[0], {
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
                    owner: Block.Owner<"XChild", true>;
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
        }, void, never>, Block.Owner<"XChild", true>, {
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
            }, void, never>, Block.Owner<"XChild", true>, {
                readonly count: number;
            }, {
                readonly _tag: "Clicked";
            }, never>;
        }>): Block.Config<Block.BoundBlockView<Block.OwnedAuthoredView<Block.View<{
            readonly count: number;
        }, {
            readonly _tag: "Clicked";
        }, void, never>, Block.Owner<"XChild", true>, {
            readonly count: number;
        }, {
            readonly _tag: "Clicked";
        }, never>, Readonly<{
            __blockBindingRequirement: Readonly<{
                placement: "child";
                generatedSchema: () => never;
                block: Readonly<{
                    owner: Block.Owner<"XChild", true>;
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
        generatedSchema: () => Schema.Codec<Readonly<{
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
            owner: Block.Owner<"XChild", true>;
            mountRequirements: () => never;
        }>;
    }>;
}>>]>, Readonly<{
    EffectsLayer: import("effect/Layer").Layer<never, never, never>;
    init: () => {
        model: {
            readonly child: {
                readonly count: number;
            };
        };
    };
    update: NoInfer<{
        (message: Readonly<{
            _tag: "GotChildMessage";
            placement: "child";
            generation: number;
            message: {
                readonly _tag: "Clicked";
            };
        }> | {
            readonly _tag: "Noted";
        }): (model: {
            readonly child: {
                readonly count: number;
            };
        }) => import("foldkit/update").ReturnWithRegistrationEvidence<{
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
        }> | {
            readonly _tag: "Noted";
        }, never, never, Readonly<{
            __blockBindingRequirement: Readonly<{
                placement: "child";
                generatedSchema: () => Schema.Codec<Readonly<{
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
                    owner: Block.Owner<"XChild", true>;
                    mountRequirements: () => never;
                }>;
            }>;
        }>>;
        (model: {
            readonly child: {
                readonly count: number;
            };
        }, message: Readonly<{
            _tag: "GotChildMessage";
            placement: "child";
            generation: number;
            message: {
                readonly _tag: "Clicked";
            };
        }> | {
            readonly _tag: "Noted";
        }): import("foldkit/update").ReturnWithRegistrationEvidence<{
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
        }> | {
            readonly _tag: "Noted";
        }, never, never, Readonly<{
            __blockBindingRequirement: Readonly<{
                placement: "child";
                generatedSchema: () => Schema.Codec<Readonly<{
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
                    owner: Block.Owner<"XChild", true>;
                    mountRequirements: () => never;
                }>;
            }>;
        }>>;
    }>;
    view: Block.OwnedAuthoredView<Block.View<{
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
    }> | {
        readonly _tag: "Noted";
    }, void, Readonly<{
        __blockBindingRequirement: Readonly<{
            placement: "child";
            generatedSchema: () => Schema.Codec<Readonly<{
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
                owner: Block.Owner<"XChild", true>;
                mountRequirements: () => never;
            }>;
        }>;
    }>>, Block.Owner<"XParent", true>, {
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
    }> | {
        readonly _tag: "Noted";
    }, Readonly<{
        __blockBindingRequirement: Readonly<{
            placement: "child";
            generatedSchema: () => Schema.Codec<Readonly<{
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
                owner: Block.Owner<"XChild", true>;
                mountRequirements: () => never;
            }>;
        }>;
    }>>;
}>>;
export declare const ParentBlock: Block.ProducedBlockWithView<Block.Owner<"XParent", true>, Schema.Struct<{
    readonly child: Schema.Struct<{
        readonly count: Schema.Number;
    }>;
}>, typeof assembleParent>;
export {};
