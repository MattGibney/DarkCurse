import { env } from 'process';
import * as pkg from '../package.json';

export interface Config {
  port: number;
  version: string;
  passwordHashingSaltRounds: number;
  jwtSecret: string;
  jwtExpiry: number;
  loggingLevel: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal' | 'silent';
  PGConnectionString: string;
}

const Config: Config = {
  port: Number(process.env.PORT) || 3000,
  version: pkg.version,
  passwordHashingSaltRounds: 10,
  jwtSecret: process.env.JWT_SECRET || 'TOKENSECRET',
  jwtExpiry: 7 * 24 * 60 * 60 * 1000,
  loggingLevel: 'info',
  PGConnectionString: process.env.DATABASE_URL,
};

// ----- Below this point is ONLY environment specific config changes. -----

/* The environment must *never* be exposed as part of the application config.
 * doing so would encourace maintainers to implement specific business logic
 * for different environments. This is something we want to avoid.
 */
const environment = env.NODE_ENV || 'development';

if (environment === 'development') {
  // Development environment
}

if (environment === 'production') {
  // Production environment
}


export default Config;