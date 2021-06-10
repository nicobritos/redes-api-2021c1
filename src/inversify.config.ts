import TYPES from './types';
import {Container} from 'inversify';
import {UserRepository} from './interfaces/repositories/UserRepository';
import {UserRepositoryImpl} from './repositories/UserRepositoryImpl';
import {UserService} from './interfaces/services/UserService';
import {UserServiceImpl} from './services/UserServiceImpl';
import {AuthService} from './interfaces/services/AuthService';
import {AuthServiceImpl} from './services/AuthServiceImpl';
import {PostRepository} from './interfaces/repositories/PostRepository';
import {PostService} from './interfaces/services/PostService';
import {PostServiceImpl} from './services/PostServiceImpl';
import {PostRepositoryImpl} from './repositories/PostRepositoryImpl';

const container = new Container();

container.bind<AuthService>(TYPES.Services.AuthService).to(AuthServiceImpl).inSingletonScope();

container.bind<PostRepository>(TYPES.Repositories.UserRepository).to(PostRepositoryImpl).inSingletonScope();
container.bind<PostService>(TYPES.Services.UserService).to(PostServiceImpl).inSingletonScope();

container.bind<UserRepository>(TYPES.Repositories.UserRepository).to(UserRepositoryImpl).inSingletonScope();
container.bind<UserService>(TYPES.Services.UserService).to(UserServiceImpl).inSingletonScope();

export default container;
