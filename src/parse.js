const fs = require('fs');
const log = require('./log');

module.exports = name => {
  const mem = [];
  const text = fs
    .readFileSync(name)
    .toString()
    .split('\n');

  text.forEach(instruction => {
    const inst = instruction.trim().split(' ');

    switch (inst[0].toLowerCase()) {
      case 'mov': {
        mem.push(0);
        mem.push(inst[1]);
        mem.push(inst[2]);
        return;
      }

      case 'var': {
        mem.push(2);
        mem.push(inst[1]);
        return;
      }

      case 'add': {
        mem.push(3);
        mem.push(inst[1]);
        return;
      }

      case 'sub': {
        mem.push(4);
        mem.push(inst[1]);
        return;
      }

      case 'mul': {
        mem.push(5);
        mem.push(inst[1]);
        return;
      }

      case 'div': {
        mem.push(6);
        mem.push(inst[1]);
        return;
      }

      case 'sys': {
        mem.push(7);
        return;
      }

      case 'end': {
        mem.push(1);
        return;
      }
    }
  });

  log(mem);
  return mem;
};
