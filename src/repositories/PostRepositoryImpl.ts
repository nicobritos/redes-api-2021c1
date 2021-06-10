import {injectable} from 'inversify';
import {getManager} from 'typeorm';
import {UserSchema} from '../interfaces/repositories/schemas/UserSchema';
import {UserRepository} from '../interfaces/repositories/UserRepository';
import {User} from '@models/User';
import {assertStringID} from '@models/utils/Utils';
import {AbstractRepositoryImpl} from './utils/AbstractRepositoryImpl';
import {Nullable} from '@models/utils/UtilityTypes';
import {Post} from '@models/Post';
import {PostSchema} from '../interfaces/repositories/schemas/PostSchema';
import {PostRepository} from '../interfaces/repositories/PostRepository';

@injectable()
export class PostRepositoryImpl extends AbstractRepositoryImpl<Post, PostSchema> implements PostRepository {
    public async findById(id: string): Promise<Nullable<Post>> {
        return this.internalFindById(id);
    }

    public async findAll(): Promise<Post[]> {
        return this.internalFindAll();
    }

    public async toEntity(schema: Nullable<PostSchema>): Promise<Nullable<Post>> {
        if (!schema) return null;

        let post = new Post();
        post.id = schema.id!;
        post.author = schema.author;
        post.title = schema.title;
        post.body = schema.body;

        return post;
    }

    public async toSchema(post: Nullable<Post>): Promise<Nullable<PostSchema>> {
        if (!post) return null;

        let schema = new PostSchema();

        if (post.id)
            schema.id = assertStringID(post.id);

        schema.author = post.author;
        schema.title = post.title;
        schema.body = post.body;

        return schema;
    }

    protected createRepository() {
        this.repository = getManager().getRepository(PostSchema);
    }
}
