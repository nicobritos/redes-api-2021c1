import {User} from '@models/User';
import {ID, Nullable} from '@models/utils/UtilityTypes';
import {Post} from '@models/Post';

export interface PostRepository {
    findById(id: ID): Promise<Nullable<Post>>;
    findAll(): Promise<Post[]>;
}
