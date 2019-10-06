const commander = require('commander');
const chalk = require('chalk');

const execute = require('./exec');

const program = new commander.Command();
program.version('1.0.0');

program.option('-e, --exec <name>', 'Execute a file');

program.parse(process.argv);

try {
  if (program.exec) execute(program.exec);
} catch (e) {
  console.log(chalk.red(e));
}
