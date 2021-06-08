export type JSONSerializableKeys<T> = {
    [Key in keyof T]?: Key extends keyof JSONSerializable<{}> ? undefined : T[Key] | any
}

export interface JSONSerializable<T> {
    toJSON(): JSONSerializableKeys<T>;
}
