const instr = require('./vm/instructions');

module.exports = {
  [instr.MOV]: 3,
  [instr.END]: 1,
  [instr.VAR]: 2,
  [instr.ADD]: 2,
  [instr.SUB]: 2,
  [instr.MUL]: 2,
  [instr.DIV]: 2,
  [instr.SYS]: 1,
  [instr.FLR]: 1,
  [instr.CEL]: 1,
  [instr.CAL]: 2
};
