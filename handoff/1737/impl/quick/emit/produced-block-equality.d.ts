export type Equal<Left, Right> = (<Value>() => Value extends Left ? 1 : 2) extends <Value>() => (Value extends Right ? 1 : 2) ? (<Value>() => Value extends Right ? 1 : 2) extends <Value>() => (Value extends Left ? 1 : 2) ? true : false : false;
export type Assert<Value extends true> = Value;
export type MembersEqual<Left, Right> = Equal<{
    [Key in keyof Left]-?: Equal<Left[Key], Key extends keyof Right ? Right[Key] : never>;
}[keyof Left], true>;
export type ReasonOf<Member> = Member[Exclude<keyof Member, 'evidence'>];
