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

// declare const process: {
//     env: {
//         ENVIRONMENT: string;
//     };
// };

// // Depending on your setup, you may want to adjust this check.
// let envFile;
// if (process.env.ENVIRONMENT === 'production') {
//     envFile = require('./environment.prod').environment;
// } else {
//     envFile = require('./environment').environment;
// }

// export const environment = envFile;
