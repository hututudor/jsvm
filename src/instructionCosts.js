const instr = require('./vm/instructions');

module.exports = {
  [instr.MOV]: 3,
  [instr.END]: 1,
  [instr.VAR]: 2,
  [instr.ADD]: 3,
  [instr.SUB]: 3,
  [instr.MUL]: 3,
  [instr.DIV]: 3,
  [instr.SYS]: 1,
  [instr.FLR]: 1,
  [instr.CEL]: 1,
  [instr.CAL]: 3,
  [instr.SLP]: 2,
  [instr.ENF]: 1,
  [instr.CMP]: 3,
  [instr.JGT]: 3,
  [instr.JLT]: 3,
  [instr.JLE]: 3,
  [instr.JGE]: 3,
  [instr.JEQ]: 3,
  [instr.JNE]: 3,
};
