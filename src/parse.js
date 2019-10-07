const fs = require('fs');
const log = require('./log');

const instructions = require('./vm/instructions');
const instructionCosts = require('./instructionCosts');

module.exports = name => {
  const mem = [];
  const text = fs
    .readFileSync(name)
    .toString()
    .split('\n');

  let index = 0;

  let functions = {};

  log(instructionCosts);

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

    if (instructionCosts[inst[0].trim().toUpperCase()]) {
      index += instructionCosts[inst[0].trim().toUpperCase()];
    }
  });

  log(functions);

  index = 0;

  text.forEach(instruction => {
    const inst = instruction.trim().split(' ');

    if (instructionCosts[inst[0].trim().toUpperCase()]) {
      index += instructionCosts[inst[0].trim().toUpperCase()];
    }

    switch (inst[0].toLowerCase()) {
      case 'mov': {
        mem.push(instructions.MOV);
        mem.push(inst[1]);
        mem.push(inst[2]);
        return;
      }

      case 'var': {
        mem.push(instructions.VAR);
        mem.push(inst[1]);
        return;
      }

      case 'add': {
        mem.push(instructions.ADD);
        mem.push(inst[1]);
        mem.push(inst[2]);
        return;
      }

      case 'sub': {
        mem.push(instructions.SUB);
        mem.push(inst[1]);
        mem.push(inst[2]);
        return;
      }

      case 'mul': {
        mem.push(instructions.MUL);
        mem.push(inst[1]);
        mem.push(inst[2]);
        return;
      }

      case 'div': {
        mem.push(instructions.DIV);
        mem.push(inst[1]);
        mem.push(inst[2]);
        return;
      }

      case 'sys': {
        mem.push(instructions.SYS);
        return;
      }

      case 'flr': {
        mem.push(instructions.FLR);
        return;
      }

      case 'cel': {
        mem.push(instructions.CEL);
        return;
      }

      case 'cal': {
        mem.push(instructions.CAL);

        if (typeof functions[inst[1]] === 'undefined') {
          throw new Error(`Unknown function: ${inst[1]}`);
        }

        mem.push(functions[inst[1]]);
        mem.push(index);
        return;
      }

      case 'slp': {
        mem.push(instructions.SLP);
        mem.push(inst[1]);
        return;
      }

      case 'enf': {
        mem.push(instructions.ENF);
        return;
      }

      case 'end': {
        mem.push(instructions.END);
        return;
      }
    }
  });

  log(mem);
  return mem;
};
