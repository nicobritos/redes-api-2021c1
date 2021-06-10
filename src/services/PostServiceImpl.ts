import {inject, injectable} from 'inversify';
import 'reflect-metadata';
import {AuthService} from '../interfaces/services/AuthService';
import TYPES from '../types';
import {ID, Nullable} from '@models/utils/UtilityTypes';
import {PostService} from '../interfaces/services/PostService';
import {PostRepository} from '../interfaces/repositories/PostRepository';
import {Post} from '@models/Post';

@injectable()
export class PostServiceImpl implements PostService {
    @inject(TYPES.Repositories.PostRepository)
    private repository: PostRepository;

    @inject(TYPES.Services.AuthService)
    private authService: AuthService;

    public async findAll(): Promise<Post[]> {
        return await this.repository.findAll();
    }

    public async findById(id: ID): Promise<Nullable<Post>> {
        return await this.repository.findById(id);
    }
}
