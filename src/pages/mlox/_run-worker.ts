import { Run } from 'mlox/src/run'

self.onmessage = function (event: MessageEvent) {
    const code = event.data;
    const { success } = run(code);
    postMessage({ done: true, success });
}

function print(msg: string) {
    postMessage({ msg })
}

function printError(msg: string) {
    postMessage({ errorMsg: msg })
}

function run(program: string) {
    const runtime = new Run(print, printError);
    const returnCode = runtime.runProgram(program);
    return { success: !returnCode };
}