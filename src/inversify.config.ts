import TYPES from './types';
import {Container} from 'inversify';
import {UserRepository} from './interfaces/repositories/UserRepository';
import {UserRepositoryImpl} from './repositories/UserRepositoryImpl';
import {UserService} from './interfaces/services/UserService';
import {UserServiceImpl} from './services/UserServiceImpl';
import {AuthService} from './interfaces/services/AuthService';
import {AuthServiceImpl} from './services/AuthServiceImpl';
import {UserControllerImpl} from './controllers/UserControllerImpl';
import {UserController} from './interfaces/controllers/UserController';

const container = new Container();

container.bind<AuthService>(TYPES.Services.AuthService).to(AuthServiceImpl).inSingletonScope();

container.bind<UserRepository>(TYPES.Repositories.UserRepository).to(UserRepositoryImpl).inSingletonScope();
container.bind<UserService>(TYPES.Services.UserService).to(UserServiceImpl).inSingletonScope();
container.bind<UserController>(TYPES.Controller).to(UserControllerImpl).inSingletonScope();

export default container;
