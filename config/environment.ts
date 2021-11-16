import { env } from 'process';

export interface Config {
  port: number;
}

const Config: Config = {
  port: Number(process.env.PORT) || 3000,
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