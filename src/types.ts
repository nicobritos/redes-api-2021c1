import repositories from './repositories/repositories.types';
import services from './services/services.types';

let TYPES = {
    Controller: Symbol('Controller'),
    Repositories: {
        ...repositories
    },
    Services: {
        ...services
    }
};

export default TYPES;
