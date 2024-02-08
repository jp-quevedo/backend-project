import winston from 'winston'
import config from '../config/dotenv.config.js'

const customLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'black',
        error: 'red',
        warning: 'yellow',
        info: 'green',
        http: 'cyan',
        debug: 'blue'
    }
}

// export const logger = winston.createLogger({
//     levels: customLevels.levels,
//     transports: [
//         new winston.transports.Console({
//             level: 'info',
//             format: winston.format.combine(
//                 winston.format.colorize({ colors: customLevels.colors }),
//                 winston.format.simple()
//             )
//         }),
//         new winston.transports.File({
//             filename: './base-logs.log',
//             level: 'warn',
//             format: winston.format.combine(
//                 winston.format.timestamp(),
//                 winston.format.prettyPrint()
//             )
//         })
//     ]
// })

export let logger

if (config.enviroment === 'production') {
    logger = winston.createLogger({
        levels: customLevels.levels,
        transports: [
            new winston.transports.Console({
                level: 'info',
                format: winston.format.combine(
                    winston.format.colorize({ colors: customLevels.colors }),
                    winston.format.simple()
                )
            }),
            new winston.transports.File({
                filename: './errors.log',
                level: 'error',
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.prettyPrint()
                )
            })
        ]
    })
} else {
    logger = winston.createLogger({
        levels: customLevels.levels,
        transports: [
            new winston.transports.Console({
                level: 'debug',
                format: winston.format.combine(
                    winston.format.colorize({ colors: customLevels.colors }),
                    winston.format.simple()
                )
            })
        ]
    })
}