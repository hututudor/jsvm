# JSVM Docs

## Introduction

Before you start, you should have the JSVM interpreter on your computer. If not, you can download it from Github.

JSVM files are marked as .jsvm to be differentiated from other types, still, having a different file extension won't affect the execution.

### Executing a script

You will need NPM to do that.

`node index.js -e <PATH>`

Additionally, you an pass a _DEBUG_ or _CLOCKSPEED_ as environment variables.
`DEBUG=true CLOCKSPEED=100 node index.js -e <PATH>`

### Clock Speed

Internally, JSVM is a virtual machine that simulates a CPU. By default the speed is set to 10. Meaning the CPU can do a max of 10 instructions per second.

### Assembly

The JSVM has an assembly-like syntax.

### Register

A register is a memory location where you can store a variable.
By default there are some registers but you can define more.

- ip -> the instruction pointer (holds the information of where the current instruction is located at)
- acc -> the accumulator (ideal for quick memory such as loops)
- out -> the out register, referenced at the sys instruction
- in -> the in register, referenced at the sys instruction
- c1, c2 -> the compare registers used for conditional statements

### Functions

Functions are defined using the following syntax.

```
<name>:
    ...
    enf
```

They can be referenced in jumps of CAL instructions.

The end of a function must be signaled by an ENF instruction.

### Values

A register value can have 2 types: number or string.

A string is determined by single or double quotes.

```
; number
mov 0 acc

; string
mov 'abc' acc
```

### Comments

They can start with ';' or '#'

```
; this is a valid comment
# also a valid comment
```

### Special characters

Since whitespace is used to determine the parameters of instructions, you cannot have any whitespace in strings.
You can use \s to make a space or an \n to make a new line.

## Instructions

A JSVM script can have different instructions that define how the program will behave.
These instructions don't need to be uppercase or lowercase.

##### MOV

Moves a value into a register.

```
mov <value|register> <register>
```

Example: `mov 2 acc` -> moves 2 in the acc register

##### END

Stops the program from execution.

```
end
```

##### VAR

Defines a new register.

```
var <name>
```

Example: `var reg` -> creates a new register named reg

##### ADD

Adds a value to a register.

```
add <value|register> <register>
```

Example: `add 2 acc` -> adds 2 to the acc register

##### SUB

Subtracts a value from a register.

Similar to the ADD instruction.

##### MUL

Multiplies a register with a value.

Similar to the ADD instruction.

##### DIV

Divides a register with a value.

Similar to the ADD instruction.

##### FLR

Floors the value from a register.

```
flr <register>
```

Example: `flr acc` -> floors the value from acc register.

##### CEL

Ceils the value from a register.

```
cel <register>
```

Example: `cel acc` -> ceils the value from acc register

##### SYS

Invokes the system.

If the out register is not null, it will be displayed in the console.
After the sys call, the out is reverted back to null.

If the in register is set to 1, the console will accept an int input, if 2 an float input, if 3 a string input and if 4, it will mask the input.
After the sys call, the in will have the input value.

```
mov 'asdf' out
mov 1 in
sys
```

##### ENF

Signals the end of a function.

If not present, the pointer will continue and will not return back in the call stack.

##### CAL

Invokes a function .

```
cal <function>
```

Example: `cal start` -> invokes the start function.

##### SLP

Sleeps an amount of milliseconds.

```
slp <value|register>
```

Example: `slp 1000` -> sleeps for one second.

##### CMP

It is a shortcut for moving 2 values into the c1 and c2 register.

```
cmp <value|register>
```

Example:

```
cmp 1 2
```

is equivalent to

```
mov 1 c1
mov 2 c2
```

##### Jumps

Are comparison functions that call a method if they are true.

They operate on the c1 and c2 registers.

- JGT -> Jump if greater than
- JGE -> Jump if greater than or equal to
- JLT -> Jump if less than
- JLE -> Jump if less than or equal to
- JEQ -> Jump if equal
- JNE -> Jump if not equal

```
JGT <function>
```

Example: `jgt start` -> jump to start if the c1 is greater than c2.

##### RND

Returns a random number in a register.
The number is from 0 to 1 in float precision.

```
rnd <register>
```
