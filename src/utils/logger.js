import winston from "winston";

const customLevelOpt = {
   levels: {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
   },
   colors: {
      error: 'red',
      warn: 'orange',
      info: 'green',
      debug: 'cyan',
   }
}

const logger = winston.createLogger({
   colorize: true,
   levels: customLevelOpt.levels,
   format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
   ),
   transports: [
      new winston.transports.Console({
         level: 'debug',
         format: winston.format.combine(
            winston.format.colorize({ color: customLevelOpt.colors }),
            winston.format.simple()
         )
      }),
      new winston.transports.File({
         filename: './errors.log',
         level: 'warn',
         format: winston.format.simple()
      })
   ]
})

export const addLogger = (req, res, next) => {
   req.logger = logger
   // req.logger.info(`${req.method} es ${req.url}`)
   next()
}