// Imports
const { createLogger, transports, format } = require('winston');

const logger = winston.createLogger({
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss'}),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    transports: [
        new transports.Console(),
    ]
});

process.on('uncaughtException', (ex) => {
    logger.error(`Uncaught Exception: ${ex.message}`, ex);
    process.exit(1); // Exit with failure status
  });
  
  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    logger.error(`Unhandled Promise Rejection: ${reason.message || reason}`, reason);
  });

// Exports
module.exports = logger;