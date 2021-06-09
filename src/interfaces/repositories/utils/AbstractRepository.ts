import {BaseEntity} from 'typeorm';
import {GenericEntity} from '@models/utils/GenericEntity';
import {Nullable} from '@models/utils/UtilityTypes';

export interface AbstractRepository<T extends GenericEntity, Schema extends BaseEntity> {
    toEntities(schemas: Array<Schema>): Promise<Array<T>>;
    toEntity(schema: Nullable<Schema>): Promise<Nullable<T>>;

    toSchemas(ts: Array<T>): Promise<Array<Schema>>;
    toSchema(t: Nullable<T>): Promise<Nullable<Schema>>;
}
