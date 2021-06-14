import {createLogger, format, transports} from 'winston';

const dir = process.env.NODE_ENV!.trim() === 'production' ? '/home/ec2-user/redes-api-2021c1/logs' : './logs';

export const mainLogger = createLogger({
    exitOnError: false,
    format: format.combine(
        format.label({
            label: 'REDES-API'
        }),
        format.timestamp(),
        format.metadata(),
        format.json(),
    ),
    transports: [
        new transports.File({
            level: 'debug',
            filename: 'debug.log',
            dirname: dir,
            maxsize: 1024 * 1024 * 10,
            tailable: true
        }),
        new transports.File({
            level: 'info',
            filename: 'info.log',
            dirname: dir,
            maxsize: 1024 * 1024 * 10,
            tailable: true
        }),
        new transports.File({
            level: 'error',
            filename: 'error.log',
            dirname: dir,
            maxsize: 1024 * 1024 * 10,
            tailable: true
        }),
        new transports.Console({
            level: 'info',
            log(info: any, next: () => void): any {
                console.log(JSON.stringify(info, null, 4));
                next();
            },
        })
    ]
});

export function childLogger(fileName: string, className: string) {
    // return mainLogger.child({ fileName: fileName, class: className });
    return mainLogger;
}
