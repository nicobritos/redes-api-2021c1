import {injectable} from 'inversify';
import {BaseEntity, Repository} from 'typeorm';
import {GenericEntity} from '@models/utils/GenericEntity';
import {ID, Nullable} from '@models/utils/UtilityTypes';
import {AbstractRepository} from '../../interfaces/repositories/utils/AbstractRepository';

@injectable()
export abstract class AbstractRepositoryImpl<T extends GenericEntity, Schema extends BaseEntity> implements AbstractRepository<T, Schema> {
    protected repository: Repository<Schema>;

    constructor() {
        this.createRepository();
    }

    public async toEntities(schemas: Array<Schema>): Promise<Array<T>> {
        let entities: Array<T> = [];
        if (!schemas || schemas.length === 0) return entities;

        for (let schema of schemas) {
            entities.push((await this.toEntity(schema))!);
        }
        return entities;
    }

    public async toSchemas(entities: Array<T>): Promise<Array<Schema>> {
        let schemas: Array<Schema> = [];
        if (!entities || entities.length === 0) return schemas;

        for (let entity of entities) {
            schemas.push((await this.toSchema(entity))!);
        }
        return schemas;
    }

    public abstract toEntity(schema: Nullable<Schema>): Promise<Nullable<T>>;

    public abstract toSchema(t: Nullable<T>): Promise<Nullable<Schema>>;

    protected async internalFindAll(): Promise<T[]> {
        return this.toEntities(await this.repository.find());
    }

    protected async internalFindById(id: ID): Promise<Nullable<T>> {
        if (id == null) throw new ReferenceError();

        return this.toEntity((await this.repository.findOne(id)) || null);
    }

    protected async internalFindByIds(ids: Array<ID>): Promise<Array<T>> {
        if (ids == null) throw new ReferenceError();
        if (ids.length === 0) return [];

        return await this.toEntities(await this.repository.findByIds(ids));
    }

    protected abstract createRepository();
}
