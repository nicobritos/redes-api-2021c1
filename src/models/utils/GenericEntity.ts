import {JSONSerializable, JSONSerializableKeys} from './JSONSerializable';
import {ID} from './UtilityTypes';

interface GenericEntityID {
    id: ID
}

export abstract class GenericEntity<T = {}> implements GenericEntityID, JSONSerializable<T> {
    abstract id: ID;

    abstract toJSON(): JSONSerializableKeys<T>;
}
