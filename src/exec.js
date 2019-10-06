const log = require('./log');
const parse = require('./parse');
const CPU = require('./vm/cpu');

module.exports = async name => {
  log(`File: ${name} executing...`);

  const memory = parse(name);
  const clockSpeed = process.env.CLOCKSPEED || 10;

  const cpu = new CPU(memory, clockSpeed);
  await cpu.clock();

  log('Done!');
};
