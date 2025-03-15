import { Run } from 'mlox/src/run'

export function run(program: string) {
    console.log("Running!!")
    let output = "";
    const print = (line: string) => {
        output = output + line + '\n';
    }
    const runtime = new Run(print)
    const returnCode = runtime.runProgram(program);
    return output; // TODO return errors
}