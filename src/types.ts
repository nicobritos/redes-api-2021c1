import repositories from './repositories/repositories.types';
import services from './services/services.types';
import controllers from './services/services.types';

let TYPES = {
    Controllers: {
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
