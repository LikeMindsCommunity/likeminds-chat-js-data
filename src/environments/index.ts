/* eslint-disable @typescript-eslint/no-var-requires */
let envFile;

// Check if process is defined and process.env.ENVIRONMENT is available
if (typeof process !== 'undefined' && process.env && process.env.ENVIRONMENT) {
    if (process.env.ENVIRONMENT === 'production') {
        envFile = require('./environment.prod').environment;
    } else {
        envFile = require('./environment').environment;
    }
} else {
    // Fallback to a default environment configuration if process.env.ENVIRONMENT is not available
    envFile = require('./environment').environment;
}

export const environment = envFile;
