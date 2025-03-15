import { useEffect, useState } from 'react'

export function Codebox() {
    const [code, setCode] = useState(defaultCode)
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);

    const [worker, setWorker] = useState<Worker | null>(null);

    useEffect(() => {
        const worker = new Worker(new URL('run-worker.ts', import.meta.url), { type: 'module' });

        console.log("Worker created:", worker);

        worker.onmessage = (event) => {
            console.log("Received event from worker:", event);
            if (event.data.done) {
                setIsRunning(false);
            } else if (event.data.msg) {
                setOutput(v => v + event.data.msg + '\n');
            }
        }

        setWorker(worker)

        return () => {
            worker.terminate();
        }
    }, [])

    function handleRun() {
        if (worker) {
            setIsRunning(true)
            worker.postMessage(code)
        }
    }

    return <div>
        <div className="flex">
            <textarea
                className="grow h-36 resize-none cursor-auto"
                value={code} onChange={(e) => setCode(e.target.value)}
            ></textarea>
        </div>
        <div className="flex my-4 items-center gap-4">
            <button onClick={handleRun} disabled={isRunning}>Run</button>
            {isRunning && <div className="progress-bar w-43"></div>}
        </div>
        <pre className="lowered h-36 whitespace-pre-wrap overflow-x-auto">
            {output ?? "Your code output will be displayed here"}
            <div style={{ overflowAnchor: 'auto', height: '1px' }}></div>
        </pre>
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