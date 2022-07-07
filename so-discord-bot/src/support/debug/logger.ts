import log from 'loglevel';
import chalk, {Chalk} from 'chalk';
import prefix from 'loglevel-plugin-prefix';

const colors: {
  [name: string]: Chalk;
} = {
  TRACE: chalk.magenta,
  DEBUG: chalk.cyan,
  INFO: chalk.blue,
  WARN: chalk.yellow,
  ERROR: chalk.red,
};

export default (level: log.LogLevelDesc) => {
  prefix.reg(log);
  log.enableAll();

  prefix.apply(log, {
    format(level, name, timestamp) {
      return `${chalk.gray(`[${timestamp}]`)} ${colors[level.toUpperCase()](level)} ${chalk.green(`${name}:`)}`;
    },
  });

  prefix.apply(log.getLogger('critical'), {
    format(level, name, timestamp) {
      return chalk.red.bold(`[${timestamp}] ${level} ${name}:`);
    },
  });

  log.setLevel(level);
};
