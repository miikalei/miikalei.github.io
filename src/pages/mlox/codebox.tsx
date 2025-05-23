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
            <li tabIndex={1} aria-haspopup="true">
                <u>G</u>o
                <ul role="menu">
                    <li>
                        <a href="/">Back to main page</a>
                    </li>
                </ul>
            </li>
        </ul >
        <div className="m-0.5">
            <p className="py-1">
                Run MLOX code in your browser! Browse the examples available in the menu bar to figure out the syntax.{' '}
                Remember, this is a toy language, so don't judge me!
            </p>
            <div className="flex font-mono">
                <textarea
                    className="grow h-42 resize-both cursor-auto"
                    value={code} onChange={(e) => setCode(e.target.value)}
                ></textarea>
            </div>
            <div className="flex my-4 items-center gap-4">
                <button onClick={handleRun} disabled={isRunning}>Run</button>
                <button onClick={handleStop} disabled={!isRunning}>Stop</button>
                {isRunning && <div className="progress-bar w-43"></div>}
            </div>
            <div className={`lowered font-mono resize-y h-42 whitespace-pre-wrap overflow-x-auto ${isError ? "text-red-500" : ''}`}>
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
`,
    "NATO compatibility test":
        `fun to_char(n) {
        if(n == 0) {
          return "p";
        }
        else if (n > 1) {
          return "!";
        }
        else {return "r";}
    }

    for (var i = 0; i*i < 5; i = i - 1 + 2) {
        print to_char(i);
    }
`

} as const;