import { useMemo, useState } from "react";
import myReduce from "./myReduce";

type Operation = "sum" | "product" | "max" | "concat" | "count";

const algorithm = `Array.prototype.myReduce = function (
  callbackFn,
  initialValue
) {
  let accumulator = initialValue;
  let start = 0;

  if (arguments.length > 1) {
    accumulator = initialValue;
  } else {
    if (initialValue === undefined) {
      while (start < this.length && !(start in this)) {
        start++;
      }

      if (start === this.length) {
        throw new Error(
          "Reduce of empty array with no initial value"
        );
      }

      accumulator = this[start];
      start++;
    }
  }

  for (let i = start; i < this.length; i++) {
    if (i in this) {
      accumulator = callbackFn(
        accumulator,
        this[i],
        i,
        this
      );
    }
  }

  return accumulator;
};`;

const ReducePlayground = () => {
  const [input, setInput] = useState("1, 2, 3, 4");
  const [operation, setOperation] = useState<Operation>("sum");
  const [useInitialValue, setUseInitialValue] = useState(true);
  const [initialValue, setInitialValue] = useState("0");

  const parsedArray = useMemo(() => {
    return input
      .split(",")
      .map((value) => value.trim())
      .filter((value) => value !== "")
      .map(Number);
  }, [input]);

  const result = useMemo(() => {
    try {
      const callback = (accumulator: number, currentValue: number) => {
        switch (operation) {
          case "sum":
            return accumulator + currentValue;

          case "product":
            return accumulator * currentValue;

          case "max":
            return Math.max(accumulator, currentValue);

          case "count":
            return accumulator + 1;

          default:
            return accumulator;
        }
      };

      if (useInitialValue) {
        return myReduce.call(parsedArray, callback, Number(initialValue));
      }

      return myReduce.call(parsedArray, callback);
    } catch (error) {
      return error instanceof Error
        ? `Error: ${error.message}`
        : "Unknown error";
    }
  }, [parsedArray, operation, useInitialValue, initialValue]);

  const executionSteps = useMemo(() => {
    if (!parsedArray.length) {
      return [];
    }

    const steps: {
      index: number;
      value: number;
      accumulator: number;
    }[] = [];

    try {
      let accumulator: number;
      let startIndex = 0;

      if (useInitialValue) {
        accumulator = Number(initialValue);
      } else {
        accumulator = parsedArray[0];
        startIndex = 1;
      }

      for (let i = startIndex; i < parsedArray.length; i++) {
        switch (operation) {
          case "sum":
            accumulator += parsedArray[i];
            break;

          case "product":
            accumulator *= parsedArray[i];
            break;

          case "max":
            accumulator = Math.max(accumulator, parsedArray[i]);
            break;

          case "count":
            accumulator += 1;
            break;
        }

        steps.push({
          index: i,
          value: parsedArray[i],
          accumulator,
        });
      }
    } catch {
      return [];
    }

    return steps;
  }, [parsedArray, operation, useInitialValue, initialValue]);

  return (
    <div className="min-h-screen bg-base-200 p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Array.prototype.reduce Playground
          </h1>

          <p className="mt-2 text-base-content/70">
            Experiment with the accumulator, initial value, callback, and
            iteration process.
          </p>
        </div>

        {/* Playground */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Controls */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Test Input</h2>

              {/* Array */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Array</span>
                </label>

                <input
                  type="text"
                  className="input input-bordered font-mono"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="1, 2, 3, 4"
                />

                <label className="label">
                  <span className="label-text-alt">
                    Enter comma-separated numbers
                  </span>
                </label>
              </div>

              {/* Operation */}
              <div className="form-control mt-3">
                <label className="label">
                  <span className="label-text font-semibold">Operation</span>
                </label>

                <select
                  className="select select-bordered"
                  value={operation}
                  onChange={(e) => setOperation(e.target.value as Operation)}
                >
                  <option value="sum">Sum</option>

                  <option value="product">Product</option>

                  <option value="max">Maximum</option>

                  <option value="count">Count</option>
                </select>
              </div>

              {/* Initial value */}
              <div className="form-control mt-4">
                <label className="label cursor-pointer">
                  <span className="label-text font-semibold">
                    Provide initial value
                  </span>

                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={useInitialValue}
                    onChange={(e) => setUseInitialValue(e.target.checked)}
                  />
                </label>
              </div>

              {useInitialValue && (
                <div className="form-control mt-2">
                  <label className="label">
                    <span className="label-text">Initial value</span>
                  </label>

                  <input
                    type="number"
                    className="input input-bordered"
                    value={initialValue}
                    onChange={(e) => setInitialValue(e.target.value)}
                  />
                </div>
              )}

              {/* Current array */}
              <div className="mt-6">
                <div className="mb-2 text-sm font-semibold">Current array</div>

                <div className="flex flex-wrap gap-2">
                  {parsedArray.map((value, index) => (
                    <div
                      key={index}
                      className="badge badge-lg badge-neutral font-mono"
                    >
                      [{index}] {value}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Result */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Result</h2>

              <div className="mt-4 flex min-h-40 items-center justify-center rounded-lg bg-neutral">
                <div className="text-center">
                  <div className="text-sm text-neutral-content/70">
                    accumulator
                  </div>

                  <div className="mt-2 text-5xl font-bold text-neutral-content">
                    {String(result)}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="text-sm text-base-content/60">
                  Equivalent operation
                </div>

                <code className="mt-2 block rounded-lg bg-base-200 p-4 font-mono text-sm">
                  {useInitialValue
                    ? `${input}.reduce(callback, ${initialValue})`
                    : `${input}.reduce(callback)`}
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Execution */}
        <div className="card mt-6 bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Execution</h2>

            <p className="text-sm text-base-content/70">
              Watch how the accumulator changes on every callback invocation.
            </p>

            {executionSteps.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Index</th>
                      <th>Current Value</th>
                      <th>Accumulator After Callback</th>
                    </tr>
                  </thead>

                  <tbody>
                    {executionSteps.map((step) => (
                      <tr key={step.index}>
                        <td>
                          <span className="badge badge-outline">
                            {step.index}
                          </span>
                        </td>

                        <td>
                          <code>{step.value}</code>
                        </td>

                        <td>
                          <span className="font-mono font-bold text-primary">
                            {step.accumulator}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="alert alert-warning mt-4">
                No callback invocations.
              </div>
            )}
          </div>
        </div>

        {/* Algorithm */}
        <div className="card mt-6 bg-base-100 shadow-xl">
          <div className="card-body">
            <div>
              <h2 className="card-title">Algorithm</h2>

              <p className="mt-2 text-sm text-base-content/70">
                The implementation determines the initial accumulator, then
                invokes the callback for each remaining element.
              </p>
            </div>

            <div className="mockup-code mt-4 overflow-x-auto">
              <pre className="px-6 py-6 text-sm leading-6">
                <code>{algorithm}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Explanation */}
        <div className="card mt-6 bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">How reduce works</h2>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg bg-base-200 p-5">
                <div className="badge badge-primary mb-3">1</div>

                <h3 className="font-semibold">Initial accumulator</h3>

                <p className="mt-2 text-sm text-base-content/70">
                  If an initial value is provided, it becomes the accumulator
                  and iteration starts at index 0.
                </p>
              </div>

              <div className="rounded-lg bg-base-200 p-5">
                <div className="badge badge-primary mb-3">2</div>

                <h3 className="font-semibold">No initial value</h3>

                <p className="mt-2 text-sm text-base-content/70">
                  The first available array element becomes the accumulator and
                  iteration starts with the next element.
                </p>
              </div>

              <div className="rounded-lg bg-base-200 p-5">
                <div className="badge badge-primary mb-3">3</div>

                <h3 className="font-semibold">Callback</h3>

                <p className="mt-2 text-sm text-base-content/70">
                  Each callback receives the accumulator, current value, index,
                  and original array.
                </p>
              </div>
            </div>

            {/* Visual flow */}
            <div className="mt-6">
              <h3 className="mb-3 font-semibold">Visual flow</h3>

              <div className="flex flex-wrap items-center gap-3 font-mono text-sm">
                <div className="rounded-lg bg-primary p-3 text-primary-content">
                  accumulator
                </div>

                <div>+</div>

                <div className="rounded-lg bg-secondary p-3 text-secondary-content">
                  currentValue
                </div>

                <div>→</div>

                <div className="rounded-lg bg-accent p-3 text-accent-content">
                  callbackFn()
                </div>

                <div>→</div>

                <div className="rounded-lg bg-success p-3 text-success-content">
                  new accumulator
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interview Notes */}
        <div className="card mt-6 bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Interview Notes</h2>

            <ul className="list-inside list-disc space-y-2 text-sm">
              <li>
                <code>this</code> is the array being reduced.
              </li>

              <li>
                <code>arguments.length &gt; 1</code> distinguishes an explicitly
                provided
                <code>undefined</code> from no initial value.
              </li>

              <li>
                The callback receives{" "}
                <code>(accumulator, currentValue, currentIndex, array)</code>.
              </li>

              <li>The callback's return value becomes the next accumulator.</li>

              <li>An empty array without an initial value should throw.</li>

              <li>
                Native <code>reduce</code> skips sparse array holes.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ReducePlayground;
