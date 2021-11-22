import Config from '../config/environment';

import * as chalk from 'chalk';
import * as bcrypt from 'bcrypt';

(async () => {
  const password = process.argv.slice(2)[0];

  console.log();
  console.log(new Array(80 + 1).join('-'));
  console.log(
    `${new Array(29 + 1).join(' ')}${chalk.green(
      'Generate Password Hash'
    )}${new Array(29 + 1).join(' ')}`
  );
  console.log(new Array(80 + 1).join('-'));
  console.log(`
  This generator is ONLY for developer use and is used to generate password hashes
  to be used in development. Do not use password hashes generated here in any
  other environment.
  `);
  console.log(
    chalk.green('Generating password hash for:'),
    chalk.red(password)
  );

  const hashedPassword = await bcrypt.hash(
    password,
    Config.passwordHashingSaltRounds
  );
  console.log(chalk.green('Password hash:'), chalk.red(hashedPassword));
})();
