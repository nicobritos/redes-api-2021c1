import TYPES from './types';

const container = new Container();

container.bind<UserRepository>(TYPES.Repositories.UserRepository).to(UserRepositoryImpl).inSingletonScope();
container.bind<UserService>(TYPES.Services.UserService).to(UserServiceImpl).inSingletonScope();

export default container;
