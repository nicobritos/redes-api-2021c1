import {ID, Nullable} from '@models/utils/UtilityTypes';
import {Post} from '@models/Post';

export interface PostService {
    findById(id: ID): Promise<Nullable<Post>>;
    findAll(): Promise<Post[]>;
}
