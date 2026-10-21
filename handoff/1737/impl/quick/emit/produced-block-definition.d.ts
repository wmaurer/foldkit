import { Schema } from 'effect';
import { Block, Message } from 'foldkit';
export declare const Model: Schema.Struct<{
    readonly count: Schema.Number;
}>;
export declare const OtherModel: Schema.Struct<{
    readonly name: Schema.String;
}>;
export declare const CounterMessage: Message.MessageUnion<{
    readonly ClickedIncrement: {};
    readonly CompletedSaveCount: {};
}>;
export declare const CounterOutMessage: Message.MessageUnion<{
    readonly ReachedLimit: {};
}>;
export declare const SaveCount: (import("../dist/command/public.js").DefinitionWithArgs<"ProducedHost/SaveCount", {
    count: Schema.Number;
}, Pick<{
    readonly count: number;
}, "count">, import("effect/Effect").Effect<{
    readonly _tag: "CompletedSaveCount";
}, never, import("../dist/command/public.js").Handler<"ProducedHost/SaveCount", {
    readonly count: number;
}, {
    readonly _tag: "CompletedSaveCount";
}>>> | import("../dist/command/public.js").DefinitionWithArgsNameKeyed<"ProducedHost/SaveCount", {
    count: Schema.Number;
}, import("effect/Effect").Effect<{
    readonly _tag: "CompletedSaveCount";
}, never, import("../dist/command/public.js").Handler<"ProducedHost/SaveCount", {
    readonly count: number;
}, {
    readonly _tag: "CompletedSaveCount";
}>>> | import("../dist/command/index.js").LayeredCommandDefinitionWithArgs<"ProducedHost/SaveCount", {
    count: Schema.Number;
}, {
    readonly _tag: "CompletedSaveCount";
}>) & Readonly<{
    toLayer: import("../dist/command/handler.js").ToLayer<"ProducedHost/SaveCount", {
        readonly count: number;
    }, {
        readonly _tag: "CompletedSaveCount";
    }>;
}>;
export declare const ViewDefinition: Block.AuthoringDefinition<"ProducedView", Schema.Struct<{
    readonly count: Schema.Number;
}>, Message.MessageUnion<{
    readonly ClickedIncrement: {};
    readonly CompletedSaveCount: {};
}>, undefined, true, undefined>;
export declare const ViewlessDefinition: Block.AuthoringDefinition<"ProducedViewless", Schema.Struct<{
    readonly count: Schema.Number;
}>, Message.MessageUnion<{
    readonly ClickedIncrement: {};
    readonly CompletedSaveCount: {};
}>, undefined, true, undefined>;
export declare const ViewOutDefinition: Block.AuthoringDefinition<"ProducedViewOut", Schema.Struct<{
    readonly count: Schema.Number;
}>, Message.MessageUnion<{
    readonly ClickedIncrement: {};
    readonly CompletedSaveCount: {};
}>, Message.MessageUnion<{
    readonly ReachedLimit: {};
}>, true, undefined>;
export declare const ViewlessOutDefinition: Block.AuthoringDefinition<"ProducedViewlessOut", Schema.Struct<{
    readonly count: Schema.Number;
}>, Message.MessageUnion<{
    readonly ClickedIncrement: {};
    readonly CompletedSaveCount: {};
}>, Message.MessageUnion<{
    readonly ReachedLimit: {};
}>, true, undefined>;
export declare const HostDefinition: Block.AuthoringDefinition<"ProducedHost", Schema.Struct<{
    readonly count: Schema.Number;
}>, Message.MessageUnion<{
    readonly ClickedIncrement: {};
    readonly CompletedSaveCount: {};
}>, undefined, true, undefined>;
export declare const ForeignDefinition: Block.AuthoringDefinition<"ProducedForeign", Schema.Struct<{
    readonly count: Schema.Number;
}>, Message.MessageUnion<{
    readonly ClickedIncrement: {};
    readonly CompletedSaveCount: {};
}>, undefined, true, undefined>;
export declare const SameIdDefinition: Block.AuthoringDefinition<"ProducedView", Schema.Struct<{
    readonly name: Schema.String;
}>, Message.MessageUnion<{
    readonly ClickedIncrement: {};
    readonly CompletedSaveCount: {};
}>, undefined, true, undefined>;
export declare const ParentDefinition: Block.AuthoringDefinition<"ProducedParent", Schema.Struct<{
    readonly child: Schema.Struct<{
        readonly count: Schema.Number;
    }>;
}>, Message.MessageUnion<{
    readonly ClickedParent: {};
}>, undefined, true, undefined>;
