import {createLogger, format, transports} from 'winston';

export const mainLogger = createLogger({
    exitOnError: false,
    format: format.combine(
        format.label({
            label: 'LatinBox-Server'
        }),
        format.timestamp(),
        format.metadata(),
        format.json(),
    ),
    transports: [
        new transports.File({
            level: 'debug',
            filename: 'debug.log',
            dirname: './logs',
            maxsize: 1024 * 1024 * 10,
            tailable: true
        }),
        new transports.File({
            level: 'info',
            filename: 'info.log',
            dirname: './logs',
            maxsize: 1024 * 1024 * 10,
            tailable: true
        }),
        new transports.File({
            level: 'error',
            filename: 'error.log',
            dirname: './logs',
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
    return mainLogger.child({ fileName: fileName, class: className });
}
