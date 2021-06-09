import * as bodyParser from 'body-parser';

import express = require('express');
import cors = require('cors');
import compression = require('compression');
import cookieParser = require('cookie-parser');
import {mainLogger} from './utils/MainLogger';
import container from './inversify.config';
import TYPES from './types';
import {RegistrableController} from './controllers/utils/RegisterableController';

require('./middlewares/passport');


function createExpressApp(): express.Application {
    let app = express();
    app.use(bodyParser.json()); // Let express support JSON bodies
    app.use(compression()); // Use gzip
    // @ts-ignore
    app.use('*', cors({
        credentials: true,
        origin: ['']  // TODO
    }));
    app.use(cookieParser());

    // Setup express middleware logging and error handling
    app.use(function (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) {
        mainLogger.error(err.stack);
        next(err);
    });

    app.use(function (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) {
        res.status(500).send('Internal Server Error');
    });

    app.listen(process.env.EXPRESS_PORT, function () {
        mainLogger.info(`App listening on port ${process.env.EXPRESS_PORT}!`);
    });

    return app;
}

function registerControllers(app: express.Application): void {
    if (!container.isBound(TYPES.Controller)) return;

    const controllers: RegistrableController[] = container.getAll<RegistrableController>(TYPES.Controller);
    controllers.forEach(controller => controller.register(app));
}

async function main() {
    let app: express.Application = createExpressApp();
    registerControllers(app);
}

main().then(() => {
    mainLogger.info('Server spun up');
});
