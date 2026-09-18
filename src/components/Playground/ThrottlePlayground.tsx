import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type LogType = "call" | "execute" | "ignored";

type LogEntry = {
  id: number;
  timestamp: number;
  type: LogType;
};

function throttle<T extends (...args: any[]) => void>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let lastExecution = 0;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    const now = Date.now();

    if (now - lastExecution >= wait) {
      lastExecution = now;
      func.apply(this, args);
    }
  };
}

const algorithm = `function throttle<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let lastExecution = 0;

  return function (
    this: ThisParameterType<T>,
    ...args: Parameters<T>
  ) {
    const now = Date.now();

    if (now - lastExecution >= wait) {
      lastExecution = now;

      func.apply(this, args);
    }
  };
}`;

export default function ThrottlePlayground() {
  const [delay, setDelay] = useState(1000);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [executionCount, setExecutionCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const counterRef = useRef(0);
  const startTimeRef = useRef(Date.now());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const addLog = useCallback((type: LogType) => {
    const timestamp = Date.now() - startTimeRef.current;

    setLogs((current) => [
      ...current,
      {
        id: ++counterRef.current,
        timestamp,
        type,
      },
    ]);
  }, []);

  const throttledFunction = useMemo(
    () =>
      throttle(() => {
        setExecutionCount((count) => count + 1);
        addLog("execute");
      }, delay),
    [delay, addLog],
  );

  const trigger = useCallback(() => {
    addLog("call");

    const beforeExecution = logs.length;

    throttledFunction();

    // The actual throttle implementation determines whether
    // the call executes. The playground uses the timestamp
    // visualization to show the difference.
    if (beforeExecution === logs.length) {
      // No-op: execution state is handled by the throttled function.
    }
  }, [addLog, throttledFunction, logs.length]);

  const startSimulation = () => {
    if (intervalRef.current) return;

    setIsRunning(true);

    intervalRef.current = setInterval(() => {
      trigger();
    }, 100);
  };

  const stopSimulation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setIsRunning(false);
  };

  const clearLogs = () => {
    stopSimulation();
    setLogs([]);
    setExecutionCount(0);
    counterRef.current = 0;
    startTimeRef.current = Date.now();
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const callCount = logs.filter((log) => log.type === "call").length;

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6">
      {/* Header */}
      <div>
        <div className="badge badge-primary mb-3">JavaScript</div>

        <h1 className="text-3xl font-bold">Throttle Playground</h1>

        <p className="mt-2 max-w-3xl text-base-content/70">
          Trigger a function repeatedly and see how throttle limits execution to
          at most once during the configured interval.
        </p>
      </div>

      {/* Controls */}
      <section className="card bg-base-200">
        <div className="card-body">
          <h2 className="card-title">Controls</h2>

          <div className="space-y-6">
            <div>
              <label className="label">
                <span className="label-text">Throttle interval</span>

                <span className="badge badge-outline">{delay} ms</span>
              </label>

              <input
                type="range"
                min="100"
                max="3000"
                step="100"
                value={delay}
                onChange={(event) => setDelay(Number(event.target.value))}
                className="range range-primary"
              />

              <div className="flex justify-between text-xs text-base-content/50">
                <span>100ms</span>
                <span>3000ms</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="btn btn-primary"
                onClick={trigger}
              >
                Trigger Function
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={isRunning ? stopSimulation : startSimulation}
              >
                {isRunning ? "Stop Rapid Calls" : "Start Rapid Calls"}
              </button>

              <button
                type="button"
                className="btn btn-ghost"
                onClick={clearLogs}
              >
                Clear
              </button>
            </div>

            <p className="text-sm text-base-content/60">
              "Start Rapid Calls" triggers the function every 100ms. Increase
              the throttle interval to see more calls being ignored.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="stat rounded-box bg-base-200">
          <div className="stat-title">Calls</div>
          <div className="stat-value text-2xl">{callCount}</div>
          <div className="stat-desc">Attempts to invoke the function</div>
        </div>

        <div className="stat rounded-box bg-base-200">
          <div className="stat-title">Executions</div>
          <div className="stat-value text-2xl">{executionCount}</div>
          <div className="stat-desc">Actual function executions</div>
        </div>

        <div className="stat rounded-box bg-base-200">
          <div className="stat-title">Suppressed</div>
          <div className="stat-value text-2xl">
            {Math.max(callCount - executionCount, 0)}
          </div>
          <div className="stat-desc">Calls blocked by throttle</div>
        </div>
      </section>

      {/* Visual timeline */}
      <section className="card border border-base-300">
        <div className="card-body">
          <h2 className="card-title">Execution timeline</h2>

          {logs.length === 0 ? (
            <div className="rounded-lg border border-dashed border-base-300 p-8 text-center text-base-content/50">
              Trigger the function or start rapid calls to see the throttle in
              action.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="min-w-[600px] space-y-3">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-center gap-3">
                    <span className="w-16 text-right font-mono text-xs text-base-content/50">
                      {log.timestamp}ms
                    </span>

                    <div
                      className={`badge ${
                        log.type === "execute"
                          ? "badge-success"
                          : "badge-warning"
                      }`}
                    >
                      {log.type}
                    </div>

                    {log.type === "call" ? (
                      <span className="text-sm text-base-content/60">
                        Function called
                      </span>
                    ) : (
                      <span className="font-semibold text-success">
                        Function executed
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Concept visualization */}
      <section className="card bg-base-200">
        <div className="card-body">
          <h2 className="card-title">How throttle works</h2>

          <div className="overflow-x-auto">
            <div className="min-w-[700px] py-6">
              <div className="mb-3 flex justify-between text-xs text-base-content/50">
                <span>0ms</span>
                <span>{delay}ms</span>
                <span>{delay * 2}ms</span>
                <span>{delay * 3}ms</span>
              </div>

              <div className="relative h-20 rounded-lg bg-base-300">
                <div className="absolute left-0 top-0 h-full border-l-2 border-success" />

                <div
                  className="absolute top-0 h-full border-l-2 border-success"
                  style={{ left: "33%" }}
                />

                <div
                  className="absolute top-0 h-full border-l-2 border-success"
                  style={{ left: "66%" }}
                />

                <div className="flex h-full items-center justify-around">
                  <span className="badge badge-success">EXECUTE</span>

                  <span className="badge badge-warning">IGNORE</span>

                  <span className="badge badge-success">EXECUTE</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-3 text-sm">
                <span className="badge badge-success">Execute</span>

                <span>once</span>

                <span className="font-bold">→</span>

                <span className="badge badge-warning">Ignore</span>

                <span>until interval expires</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Algorithm */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold">Algorithm</h2>

          <p className="mt-1 text-base-content/70">
            The core idea is to remember when the function last executed.
          </p>
        </div>

        <div className="mockup-code text-sm">
          <pre className="overflow-x-auto px-6 py-4">
            <code>{algorithm}</code>
          </pre>
        </div>
      </section>

      {/* Steps */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Step by step</h2>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="card border border-base-300">
            <div className="card-body">
              <div className="badge badge-primary">1</div>

              <h3 className="font-bold">Store last execution</h3>

              <p className="text-sm text-base-content/70">
                Keep track of when the function last ran.
              </p>
            </div>
          </div>

          <div className="card border border-base-300">
            <div className="card-body">
              <div className="badge badge-primary">2</div>

              <h3 className="font-bold">Get current time</h3>

              <p className="text-sm text-base-content/70">
                Calculate how much time has passed.
              </p>
            </div>
          </div>

          <div className="card border border-base-300">
            <div className="card-body">
              <div className="badge badge-primary">3</div>

              <h3 className="font-bold">Check interval</h3>

              <p className="text-sm text-base-content/70">
                Execute only if enough time has passed.
              </p>
            </div>
          </div>

          <div className="card border border-base-300">
            <div className="card-body">
              <div className="badge badge-primary">4</div>

              <h3 className="font-bold">Update timestamp</h3>

              <p className="text-sm text-base-content/70">
                Record the new execution time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Debounce comparison */}
      <section className="card border border-base-300">
        <div className="card-body">
          <h2 className="card-title">Throttle vs Debounce</h2>

          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th></th>
                  <th>Throttle</th>
                  <th>Debounce</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <th>Behavior</th>
                  <td>Limits execution rate</td>
                  <td>Waits for inactivity</td>
                </tr>

                <tr>
                  <th>During rapid calls</th>
                  <td>Executes periodically</td>
                  <td>Keeps resetting timer</td>
                </tr>

                <tr>
                  <th>After calls stop</th>
                  <td>Nothing special</td>
                  <td>Executes after delay</td>
                </tr>

                <tr>
                  <th>Typical use</th>
                  <td>Scroll, resize, mousemove</td>
                  <td>Search, autocomplete, validation</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Interview takeaway */}
      <section className="alert alert-info">
        <div>
          <h3 className="font-bold">Interview takeaway</h3>

          <p className="mt-1 text-sm">
            <strong>Throttle</strong> guarantees that a function executes at
            most once per specified interval. Instead of resetting a timer like
            debounce, it checks how much time has passed since the last
            execution.
          </p>
        </div>
      </section>
    </div>
  );
}
