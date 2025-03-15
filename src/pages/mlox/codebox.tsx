import { useState } from 'react'

export function Codebox() {
    const [code, setCode] = useState(defaultCode)
    const [output, setOutput] = useState('');

    return <div>
        <div className="flex">
            <textarea
                className="grow h-36 resize-none"
                value={code} onChange={(e) => setCode(e.target.value)}
            ></textarea>
        </div>
        <div className="m-4">
            <button onClick={() => console.log("running code")}>Run</button>
            <progress>Indeterminate</progress>
        </div>
        <div className="lowered h-36">
            Your code output will be displayed here
        </div>
    </div>
}

const defaultCode = `\
fun fib(n) {
  if (n <= 1) return n;
  return fib(n - 2) + fib(n - 1);
}

for (var i = 0; i < 20; i = i + 1) {
  print fib(i);
}
`