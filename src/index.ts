import 'reflect-metadata';
import path from 'path';

let cnf = require('dotenv').config({ path: path.join(__dirname, '../config.env') });

import * as bodyParser from 'body-parser';
import express = require('express');
import cors = require('cors');
import compression = require('compression');
import cookieParser = require('cookie-parser');
import {mainLogger} from './utils/MainLogger';
import container from './inversify.config';
import TYPES from './types';
import {RegistrableController} from './controllers/utils/RegisterableController';
import {Connection, createConnection, getConnectionOptions} from 'typeorm';

require('./middlewares/passport');

process.env.NODE_ENV = process.env.NODE_ENV!.trim();

function createExpressApp(): express.Application {
    let app = express();
    app.use(bodyParser.json()); // Let express support JSON bodies
    app.use(compression()); // Use gzip
    // @ts-ignore
    app.use('*', cors({
        credentials: true,
        origin: function (origin, callback) {
            callback(null, true)
        }
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
    for (let name of Object.values(TYPES.Controller)) {
        container.get<RegistrableController>(name).register(app);
    }
}

async function connectDatabase(): Promise<Connection> {
    let connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
    return createConnection({...connectionOptions, name: 'default'});
}

async function main() {
    if (cnf.error) {
        mainLogger.warn('Couldn\'t find the .env file. Assumes all the necessary params are provided via ENV');
    }

    await connectDatabase();
    let app: express.Application = createExpressApp();
    registerControllers(app);
}

main().then(() => {
    mainLogger.info('Server spun up');
});
