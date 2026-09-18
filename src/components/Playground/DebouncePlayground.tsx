import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type LogEntry = {
  id: number;
  timestamp: number;
  type: "call" | "execute" | "reset";
  value: string;
};

function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timer);

    timer = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}

const algorithm = `type DebouncedFunction<
  T extends (...args: any[]) => any
> = (
  this: ThisParameterType<T>,
  ...args: Parameters<T>
) => void;

function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): DebouncedFunction<T> {
  let timer: ReturnType<typeof setTimeout>;

  return function (
    this: ThisParameterType<T>,
    ...args: Parameters<T>
  ) {
    clearTimeout(timer);

    timer = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}`;

const DebouncePlayground = () => {
  const [delay, setDelay] = useState(1000);
  const [value, setValue] = useState("");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [executedValue, setExecutedValue] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);

  const counterRef = useRef(0);
  const startTimeRef = useRef(Date.now());

  const addLog = useCallback((type: LogEntry["type"], logValue: string) => {
    const now = Date.now();

    setLogs((current) => [
      ...current,
      {
        id: ++counterRef.current,
        timestamp: now - startTimeRef.current,
        type,
        value: logValue,
      },
    ]);
  }, []);

  const debouncedHandler = useMemo(
    () =>
      debounce((nextValue: string) => {
        setExecutedValue(nextValue);
        setIsWaiting(false);
        addLog("execute", nextValue);
      }, delay),
    [delay, addLog],
  );

  useEffect(() => {
    return () => {
      // Playground cleanup.
    };
  }, []);

  const handleCall = (nextValue: string) => {
    setValue(nextValue);
    setIsWaiting(true);

    addLog("call", nextValue);
    addLog("reset", `Timer → ${delay}ms`);

    debouncedHandler(nextValue);
  };

  const clearLogs = () => {
    setLogs([]);
    setExecutedValue("");
    setValue("");
    setIsWaiting(false);
    counterRef.current = 0;
    startTimeRef.current = Date.now();
  };

  const callCount = logs.filter((log) => log.type === "call").length;
  const executionCount = logs.filter((log) => log.type === "execute").length;

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6">
      {/* Header */}
      <div>
        <div className="badge badge-primary mb-3">JavaScript</div>

        <h1 className="text-3xl font-bold">Debounce Playground</h1>

        <p className="mt-2 max-w-3xl text-base-content/70">
          Experiment with debounce by triggering multiple calls quickly. Every
          new call resets the timer, so the function only executes after the
          calls stop.
        </p>
      </div>

      {/* Controls */}
      <section className="card bg-base-200">
        <div className="card-body">
          <h2 className="card-title">Controls</h2>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Delay */}
            <div>
              <label className="label">
                <span className="label-text">Debounce delay</span>

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

              <div className="mt-1 flex justify-between text-xs text-base-content/50">
                <span>100ms</span>
                <span>3000ms</span>
              </div>
            </div>

            {/* Current value */}
            <div>
              <label className="label">
                <span className="label-text">Current value</span>
              </label>

              <input
                value={value}
                onChange={(event) => handleCall(event.target.value)}
                placeholder="Type quickly..."
                className="input input-bordered w-full"
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {["A", "B", "C", "D", "E"].map((item) => (
              <button
                key={item}
                type="button"
                className="btn btn-outline"
                onClick={() => handleCall(item)}
              >
                Call "{item}"
              </button>
            ))}

            <button type="button" className="btn btn-ghost" onClick={clearLogs}>
              Clear
            </button>
          </div>
        </div>
      </section>

      {/* Current state */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="stat rounded-box bg-base-200">
          <div className="stat-title">Calls</div>
          <div className="stat-value text-2xl">{callCount}</div>
          <div className="stat-desc">
            Every invocation of the debounced function
          </div>
        </div>

        <div className="stat rounded-box bg-base-200">
          <div className="stat-title">Executions</div>
          <div className="stat-value text-2xl">{executionCount}</div>
          <div className="stat-desc">Actual function executions</div>
        </div>

        <div className="stat rounded-box bg-base-200">
          <div className="stat-title">Status</div>
          <div className="stat-value text-2xl">
            {isWaiting ? "Waiting" : "Idle"}
          </div>
          <div className="stat-desc">
            {isWaiting
              ? `Waiting ${delay}ms after the latest call`
              : "No pending execution"}
          </div>
        </div>
      </section>

      {/* Visual explanation */}
      <section className="card border border-base-300">
        <div className="card-body">
          <h2 className="card-title">What's happening?</h2>

          <div className="overflow-x-auto">
            <div className="min-w-[650px] space-y-3">
              {logs.length === 0 ? (
                <div className="rounded-lg border border-dashed border-base-300 p-8 text-center text-base-content/50">
                  Click several buttons quickly to see debounce in action.
                </div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="flex items-center gap-3">
                    <div className="w-14 text-right font-mono text-xs text-base-content/50">
                      {log.timestamp}ms
                    </div>

                    <div
                      className={`badge ${
                        log.type === "call"
                          ? "badge-info"
                          : log.type === "execute"
                            ? "badge-success"
                            : "badge-warning"
                      }`}
                    >
                      {log.type}
                    </div>

                    <div className="font-mono">{log.value}</div>

                    {log.type === "call" && (
                      <span className="text-sm text-base-content/60">
                        → reset timer
                      </span>
                    )}

                    {log.type === "execute" && (
                      <span className="text-sm text-success">
                        → function actually ran
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Result */}
      <section className="card bg-base-200">
        <div className="card-body">
          <h2 className="card-title">Debounced result</h2>

          <div className="rounded-lg bg-base-300 p-6 text-center">
            {executedValue ? (
              <>
                <div className="text-sm text-base-content/60">
                  Function executed with
                </div>

                <div className="mt-2 text-5xl font-bold">{executedValue}</div>
              </>
            ) : (
              <div className="text-base-content/50">
                Nothing has executed yet
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Algorithm */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold">Algorithm</h2>

          <p className="mt-1 text-base-content/70">
            This is the core implementation behind the playground.
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
        <h2 className="text-2xl font-bold">How debounce works</h2>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="card border border-base-300">
            <div className="card-body">
              <div className="badge badge-primary">1</div>

              <h3 className="font-bold">Call function</h3>

              <p className="text-sm text-base-content/70">
                The returned debounced function is called.
              </p>
            </div>
          </div>

          <div className="card border border-base-300">
            <div className="card-body">
              <div className="badge badge-primary">2</div>

              <h3 className="font-bold">Clear timer</h3>

              <p className="text-sm text-base-content/70">
                Any existing timer is cancelled.
              </p>
            </div>
          </div>

          <div className="card border border-base-300">
            <div className="card-body">
              <div className="badge badge-primary">3</div>

              <h3 className="font-bold">Start timer</h3>

              <p className="text-sm text-base-content/70">
                A new timer starts counting down.
              </p>
            </div>
          </div>

          <div className="card border border-base-300">
            <div className="card-body">
              <div className="badge badge-primary">4</div>

              <h3 className="font-bold">Execute</h3>

              <p className="text-sm text-base-content/70">
                If no new call happens, the function runs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="card bg-base-200">
        <div className="card-body">
          <h2 className="card-title">Example: 3 rapid calls</h2>

          <div className="overflow-x-auto">
            <div className="min-w-[700px] space-y-4 py-4">
              <div className="flex items-center gap-3">
                <span className="w-16 text-sm">0ms</span>

                <div className="rounded bg-info px-4 py-2 text-info-content">
                  Call A
                </div>

                <div className="h-px flex-1 bg-base-content/20" />

                <span className="text-sm">Timer starts</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-16 text-sm">300ms</span>

                <div className="rounded bg-info px-4 py-2 text-info-content">
                  Call B
                </div>

                <div className="h-px flex-1 bg-base-content/20" />

                <span className="text-sm">Timer reset</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-16 text-sm">600ms</span>

                <div className="rounded bg-info px-4 py-2 text-info-content">
                  Call C
                </div>

                <div className="h-px flex-1 bg-base-content/20" />

                <span className="text-sm">Timer reset</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-16 text-sm">1600ms</span>

                <div className="rounded bg-success px-4 py-2 text-success-content">
                  Execute C
                </div>

                <div className="h-px flex-1 bg-base-content/20" />

                <span className="font-semibold text-success">
                  Only the last call executes
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interview notes */}
      <section className="alert alert-info">
        <div>
          <h3 className="font-bold">Interview takeaway</h3>

          <p className="mt-1 text-sm">
            Debounce delays execution until a specified period of inactivity.
            Every new invocation cancels the previous timer and starts a new
            one.
          </p>
        </div>
      </section>
    </div>
  );
};
export default DebouncePlayground;
