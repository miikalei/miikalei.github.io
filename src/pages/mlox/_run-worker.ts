import { Run } from 'mlox/src/run'

self.onmessage = function (event: MessageEvent) {
    const code = event.data;
    run(code);
    postMessage({ done: true, msg: null });
}

function print(msg: string) {
    postMessage({ done: false, msg })
}

function run(program: string) {
    console.log("Running!!");
    const runtime = new Run(print);
    const returnCode = runtime.runProgram(program);
    return returnCode;
}