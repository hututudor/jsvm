const fs = require('fs');
const log = require('./log');

module.exports = name => {
  const mem = [];
  const text = fs
    .readFileSync(name)
    .toString()
    .split('\n');

  let index = 0;

  let functions = {};

  text.forEach(instruction => {
    const inst = instruction.trim().split(' ');

    if (inst.join('').includes(':')) {
      let ins = inst
        .join('')
        .replace(/:/g, '')
        .trim();

      if (typeof functions[ins] !== 'undefined') {
        throw new Error(`Duplicate function declaration: ${ins}`);
      }

      functions[ins] = index;

      return;
    }

    switch (inst[0]) {
      case 'mov': {
        index += 3;
        return;
      }

      case 'var': {
        index += 2;
        return;
      }

      case 'add': {
        index += 2;
        return;
      }

      case 'sub': {
        index += 2;
        return;
      }

      case 'mul': {
        index += 2;

        return;
      }

      case 'div': {
        index += 2;

        return;
      }

      case 'sys': {
        index += 1;
        return;
      }

      case 'flr': {
        index += 1;
        return;
      }

      case 'cel': {
        index += 1;
        return;
      }

      case 'end': {
        index += 1;
        return;
      }

      case 'cal': {
        index += 2;
        return;
      }
    }
  });

  log(functions);

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

      case 'flr': {
        mem.push(8);
        return;
      }

      case 'cel': {
        mem.push(9);
        return;
      }

      case 'cal': {
        mem.push(10);

        if (typeof functions[inst[1]] === 'undefined') {
          throw new Error(`Unknown function: ${inst[1]}`);
        }

        mem.push(functions[inst[1]]);
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
