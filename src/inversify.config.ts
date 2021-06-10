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
import {UserControllerImpl} from './controllers/UserControllerImpl';
import {UserController} from './interfaces/controllers/UserController';
import {PostController} from './interfaces/controllers/PostController';
import {PostControllerImpl} from './controllers/PostControllerImpl';
import {ProcessControllerImpl} from './controllers/ProcessControllerImpl';
import {ProcessController} from './interfaces/controllers/ProcessController';

const container = new Container();

container.bind<AuthService>(TYPES.Services.AuthService).to(AuthServiceImpl).inSingletonScope();

container.bind<PostRepository>(TYPES.Repositories.PostRepository).to(PostRepositoryImpl).inSingletonScope();
container.bind<PostService>(TYPES.Services.PostService).to(PostServiceImpl).inSingletonScope();
container.bind<PostController>(TYPES.Controller.PostController).to(PostControllerImpl).inSingletonScope();

container.bind<ProcessController>(TYPES.Controller.ProcessController).to(ProcessControllerImpl).inSingletonScope();

container.bind<UserRepository>(TYPES.Repositories.UserRepository).to(UserRepositoryImpl).inSingletonScope();
container.bind<UserService>(TYPES.Services.UserService).to(UserServiceImpl).inSingletonScope();
container.bind<UserController>(TYPES.Controller.UserController).to(UserControllerImpl).inSingletonScope();

export default container;
