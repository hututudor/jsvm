const rl = require('readline-sync');

const instructions = require('./instructions');

class CPU {
  constructor(memory, clockSpeed) {
    this.memory = memory;
    this.clockSpeed = clockSpeed;

    this.running = true;

    this.callStack = [];

    this.registers = {
      ip: 0,
      acc: 0,
      out: null,
      in: null
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

  async execute(instruction) {
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
        const register = this.fetch();
        this.setRegister(
          register,
          this.getRegister(register) + this.getValue(value)
        );
        return;
      }

      case instructions.SUB: {
        const value = this.fetch();
        const register = this.fetch();
        this.setRegister(
          register,
          this.getRegister(register) - this.getValue(value)
        );
        return;
      }

      case instructions.MUL: {
        const value = this.fetch();
        const register = this.fetch();
        this.setRegister(
          register,
          this.getRegister(register) * this.getValue(value)
        );
        return;
      }

      case instructions.DIV: {
        const value = this.fetch();
        const register = this.fetch();

        this.setRegister(
          register,
          this.getRegister(register) / this.getValue(value)
        );
        return;
      }

      case instructions.SYS: {
        const out = this.getRegister('out');
        const inr = this.getRegister('in');

        if (out) {
          console.log(out);
        }

        if (inr === 1) {
          const res = await rl.questionInt();
          this.setRegister('in', res);
        }

        if (inr === 2) {
          const res = await rl.questionFloat();
          this.setRegister('in', res);
        }

        if (inr === 3) {
          const res = await rl.question();
          this.setRegister('in', res);
        }

        if (inr === 4) {
          const res = await rl.question('', { hideEchoBack: true });
          this.setRegister('in', res);
        }

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
        const pointer = this.fetch();
        this.setRegister('ip', value);
        this.callStack.push(pointer);
        return;
      }

      case instructions.SLP: {
        const value = this.fetch();
        await this.sleep(this.getValue(value));
        return;
      }

      case instructions.ENF: {
        const pointer = this.callStack.pop();

        if (typeof pointer === 'undefined') {
          throw new Error('Call stack is empty');
        }

        this.setRegister('ip', pointer);
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

  async step() {
    const instruction = this.fetch();

    const e = await this.execute(instruction);

    if (process.env.DEBUG) {
      this.debug();
    }

    return e;
  }

  async clock() {
    while (this.running) {
      await this.step();
      await this.sleep(1000 / this.clockSpeed);
    }
  }

  sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }
}

module.exports = CPU;
