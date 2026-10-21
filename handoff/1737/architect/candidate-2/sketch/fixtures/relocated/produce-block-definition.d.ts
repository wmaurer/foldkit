import { Schema } from 'effect';
import { Block } from 'foldkit';
export declare const Model: Schema.Struct<{
    readonly count: Schema.Number;
}>;
export declare const OtherModel: Schema.Struct<{
    readonly name: Schema.String;
}>;
export declare const Message: import("foldkit/message").MessageUnion<{
    readonly Clicked: {};
}>;
export declare const OutMessage: import("foldkit/message").MessageUnion<{
    readonly Done: {};
}>;
export declare const ViewDefinition: Block.AuthoringDefinition<"ProduceView", Schema.Struct<{
    readonly count: Schema.Number;
}>, import("foldkit/message").MessageUnion<{
    readonly Clicked: {};
}>, undefined, true, undefined>;
export declare const ViewOutDefinition: Block.AuthoringDefinition<"ProduceViewOut", Schema.Struct<{
    readonly count: Schema.Number;
}>, import("foldkit/message").MessageUnion<{
    readonly Clicked: {};
}>, import("foldkit/message").MessageUnion<{
    readonly Done: {};
}>, true, undefined>;
export declare const HeadlessDefinition: Block.AuthoringDefinition<"ProduceHeadless", Schema.Struct<{
    readonly count: Schema.Number;
}>, import("foldkit/message").MessageUnion<{
    readonly Clicked: {};
}>, undefined, true, undefined>;
export declare const HeadlessOutDefinition: Block.AuthoringDefinition<"ProduceHeadlessOut", Schema.Struct<{
    readonly count: Schema.Number;
}>, import("foldkit/message").MessageUnion<{
    readonly Clicked: {};
}>, import("foldkit/message").MessageUnion<{
    readonly Done: {};
}>, true, undefined>;
export declare const ForeignDefinition: Block.AuthoringDefinition<"ProduceForeign", Schema.Struct<{
    readonly name: Schema.String;
}>, import("foldkit/message").MessageUnion<{
    readonly Clicked: {};
}>, undefined, true, undefined>;
export declare const SameModelDefinition: Block.AuthoringDefinition<"ProduceSameModel", Schema.Struct<{
    readonly count: Schema.Number;
}>, import("foldkit/message").MessageUnion<{
    readonly Clicked: {};
}>, undefined, true, undefined>;
export declare const SameIdDefinition: Block.AuthoringDefinition<"ProduceView", Schema.Struct<{
    readonly name: Schema.String;
}>, import("foldkit/message").MessageUnion<{
    readonly Clicked: {};
}>, undefined, true, undefined>;
export declare const TwinDefinition: Block.AuthoringDefinition<"ProduceView", Schema.Struct<{
    readonly count: Schema.Number;
}>, import("foldkit/message").MessageUnion<{
    readonly Clicked: {};
}>, undefined, true, undefined>;
export declare const OutTwinDefinition: Block.AuthoringDefinition<"ProduceView", Schema.Struct<{
    readonly count: Schema.Number;
}>, import("foldkit/message").MessageUnion<{
    readonly Clicked: {};
}>, import("foldkit/message").MessageUnion<{
    readonly Done: {};
}>, true, undefined>;
export declare const ParentDefinition: Block.AuthoringDefinition<"ProduceParent", Schema.Struct<{
    readonly child: Schema.Struct<{
        readonly count: Schema.Number;
    }>;
}>, import("foldkit/message").MessageUnion<{
    readonly Noted: {};
}>, undefined, true, undefined>;
