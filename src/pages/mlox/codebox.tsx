import { useCallback, useEffect, useRef, useState } from 'react'

export function Codebox() {
    const [code, setCode] = useState<string>(examplePrograms["Recursive fibonacci"]);
    const [output, setOutput] = useState('');
    const [errOutput, setErrOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [isError, setIsError] = useState(false);

    const [worker, setWorker] = useState<Worker | null>(null);

    // Get scroll anchor to view immediately
    const anchorRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        anchorRef.current?.scrollIntoView();
    }, [anchorRef]);

    const initWorker = useCallback(() => {
        const worker = new Worker(new URL('_run-worker.ts', import.meta.url), { type: 'module' });

        worker.onmessage = (event) => {
            if (event.data.done) {
                setIsRunning(false);
                if (!event.data.success) {
                    setIsError(true);
                }
            } else if (event.data.msg) {
                setOutput(v => v + event.data.msg + '\n');
            } else if (event.data.errorMsg) {
                setErrOutput(v => v + event.data.errorMsg + '\n');
            }
        }

        setWorker(worker)
    }, [setIsRunning, setIsError, setOutput, setErrOutput])

    useEffect(() => {
        initWorker();

        return () => {
            if (worker) {
                worker.terminate();
            }
        }
    }, [])

    function handleRun() {
        setOutput('');
        setErrOutput('');
        setIsError(false);
        if (worker) {
            setIsRunning(true);
            worker.postMessage(code);
        }
    }

    function handleStop() {
        setOutput('Execution was interrupted.');
        setErrOutput('');
        setIsError(false);
        if (worker) {
            worker.terminate();
            setIsRunning(false);
            initWorker();
        }
    }

    return <div>
        <ul role="menubar">
            <li tabIndex={0} aria-haspopup="true">
                <u>L</u>oad example
                <ul role="menu">
                    {Object.entries(examplePrograms).map(([name, program], index) => {
                        return <li tabIndex={index} onClick={() => {
                            setCode(program);
                            if (document.activeElement && 'blur' in document.activeElement && typeof document.activeElement.blur === 'function') {
                                document.activeElement.blur();
                            }
                        }}>{name}</li>
                    })}
                </ul>
            </li>
        </ul >
        <div className="m-0.5">
            <p>
                Run MLOX code anywhere, powered by modern javascript!
                <small>Remember, this is a toy language </small>
            </p>
            <div className="flex">
                <textarea
                    className="grow h-42 resize-none cursor-auto"
                    value={code} onChange={(e) => setCode(e.target.value)}
                ></textarea>
            </div>
            <div className="flex my-4 items-center gap-4">
                <button onClick={handleRun} disabled={isRunning}>Run</button>
                <button onClick={handleStop} disabled={!isRunning}>Stop</button>
                {isRunning && <div className="progress-bar w-43"></div>}
            </div>
            <div className={`lowered h-42 whitespace-pre-wrap overflow-x-auto ${isError ? "text-red-500" : ''}`}>
                <div className='[overflow-anchor:none] min-h-42'>
                    {errOutput || output || "Your code output will be displayed here"}
                </div>
                <div ref={anchorRef} className='[overflow-anchor:auto] [height:1px]'></div>
            </div>
        </div>
    </div >
}

const examplePrograms = {
    "Recursive fibonacci": `\
fun fib(n) {
  if (n <= 1) return n;
  return fib(n - 2) + fib(n - 1);
}

for (var i = 0; i < 20; i = i + 1) {
  print fib(i);
}
    `,
    "Inheritance with static scoping": `\
class A {
          method() {
            print "A method";
          }
        }

        class B < A {
          method() {
            print "B method";
          }

          test() {
            super.method();
          }
        }

        class C < B {}

        C().test();    
`
} as const;