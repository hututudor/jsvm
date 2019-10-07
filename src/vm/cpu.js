const instructions = require('./instructions');

class CPU {
  constructor(memory, clockSpeed) {
    this.memory = memory;
    this.clockSpeed = clockSpeed;

    this.running = true;

    this.registers = {
      ip: 0,
      acc: 0,
      out: null
    };
  }

  debug() {
    Object.keys(this.registers).forEach(name => {
      console.log(`${name}: ${this.registers[name]}`);
    });
    console.log();
  }

  addRegister(name) {
    if (this.isRegister(name)) {
      throw new Error(`addRegister: Register '${name}' already exists`);
    }

    this.registers[name] = 0;
  }

  getRegister(name) {
    if (!this.isRegister(name)) {
      throw new Error(`getRegister: No such register '${name}'`);
    }
    return this.registers[name];
  }

  setRegister(name, value) {
    if (!this.isRegister(name)) {
      throw new Error(`setRegister: No such register '${name}'`);
    }
    this.registers[name] = value;
    return this.registers[name];
  }

  isRegister(name) {
    return typeof this.registers[name] !== 'undefined';
  }

  fetch() {
    const nextInstructionAddress = this.getRegister('ip');
    const instruction = this.memory[nextInstructionAddress];
    this.setRegister('ip', nextInstructionAddress + 1);
    return instruction;
  }

  execute(instruction) {
    switch (instruction) {
      case instructions.MOV: {
        const value = this.fetch();
        const register = this.fetch();

        this.setRegister(register, this.getValue(value));

        return;
      }

      case instructions.VAR: {
        const register = this.fetch();
        this.addRegister(register);
        return;
      }

      case instructions.ADD: {
        const value = this.fetch();
        this.setRegister('acc', this.getRegister('acc') + this.getValue(value));
        return;
      }

      case instructions.SUB: {
        const value = this.fetch();
        this.setRegister('acc', this.getRegister('acc') - this.getValue(value));
        return;
      }

      case instructions.MUL: {
        const value = this.fetch();
        this.setRegister('acc', this.getRegister('acc') * this.getValue(value));
        return;
      }

      case instructions.DIV: {
        const value = this.fetch();
        this.setRegister('acc', this.getRegister('acc') / this.getValue(value));
        return;
      }

      case instructions.SYS: {
        const out = this.getRegister('out');
        console.log(out);
        this.setRegister('out', null);
        return;
      }

      case instructions.FLR: {
        this.setRegister('acc', Math.floor(this.getRegister('acc')));
        return;
      }

      case instructions.CEL: {
        this.setRegister('acc', Math.ceil(this.getRegister('acc')));
        return;
      }

      case instructions.CAL: {
        const value = this.fetch();
        this.setRegister('ip', value);
        return;
      }

      case instructions.END: {
        this.running = false;
      }
    }
  }

  getValue(value) {
    if (this.isRegister(value)) {
      return this.getRegister(value);
    } else if (!value.includes('"') && !value.includes("'")) {
      return parseInt(value);
    } else {
      return value
        .replace(/["']/g, '')
        .replace(/\\s/g, ' ')
        .replace(/\\n/g, '\n');
    }
  }

  step() {
    if (process.env.DEBUG) {
      this.debug();
    }

    const instruction = this.fetch();
    return this.execute(instruction);
  }

  async clock() {
    while (this.running) {
      this.step();
      await this.sleep(1000 / this.clockSpeed);
    }
  }

  sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }
}

module.exports = CPU;
