import { Logger } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

const logLevels: winston.Logform.ColorizeOptions = {
    message: true,
    colors: { info: 'blue', error: 'red', debug: 'green' }
};

const commonFormats = [
    winston.format.timestamp(),
    winston.format.align(),
    winston.format.printf(
        (message) => `NestJs Backend Service:${message.timestamp}:${message.level}:${message.message}`
    )
];

const loggerTransports = [
    new winston.transports.Console({
        format: winston.format.combine(winston.format.colorize(logLevels), ...commonFormats)
    }),
    new winston.transports.File({
        filename: 'logs/combined.log',
        maxFiles: 5,
        maxsize: 1000 * 1024 * 50, // in bytes
        format: winston.format.combine(...commonFormats)
    }),
    new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
        maxFiles: 5,
        maxsize: 1000 * 1024 * 50, // in bytes
        format: winston.format.combine(...commonFormats)
    })
];

/**
 * Method Decorator is used for logging entry point and exit point of the function
 * @param target
 * @param name
 * @param descriptor
 */
export const PrintLog = (target, name, descriptor) => {
    const className = target.constructor.name;
    const original = descriptor.value;
    descriptor.value = new Proxy(original, {
        apply: function (target, thisArg, args) {
            Logger.log(`${className}:${name}: Enter`);
            const result = original.apply(thisArg, args);
            const exitLog = () => {
                Logger.log(`${className}:${name}: Exit`);
            };
            if (typeof result === 'object' && typeof result.then === 'function') {
                const promise = result.then(exitLog);
                if (typeof promise.catch === 'function') {
                    promise.catch((e: any) => e);
                }
            } else exitLog();
            return result;
        }
    });
};

export function InjectLogs() {
    return (target: Function) => {
        for (const propertyName of Object.getOwnPropertyNames(target.prototype)) {
            const descriptor = Object.getOwnPropertyDescriptor(target.prototype, propertyName);
            if (!descriptor) {
                continue;
            }
            const originalMethod = descriptor.value;
            const isMethod = originalMethod instanceof Function;
            if (!isMethod) {
                continue;
            }
            descriptor.value = function (...args: any[]) {
                Logger.log(`${target.name}:${propertyName}: Enter`);
                const result = originalMethod.apply(this, args);
                const exitLog = () => Logger.log(`${target.name}:${propertyName}: Exit`);
                if (typeof result === 'object' && typeof result.then === 'function') {
                    const promise = result.then(exitLog);
                    if (typeof promise.catch === 'function') {
                        promise.catch((e: any) => e);
                    }
                } else {
                    exitLog();
                }
                return result;
            };

            Object.defineProperty(target.prototype, propertyName, descriptor);
        }
    };
}

export function winstonLoggerService() {
    return WinstonModule.createLogger({ transports: loggerTransports });
}
