import repositories from './repositories/repositories.types';
import services from './services/services.types';
import controllers from './controllers/controllers.types';

let TYPES = {
    Controller: {
        ...controllers
    },
    Repositories: {
        ...repositories
    },
    Services: {
        ...services
    }
};

export default TYPES;
