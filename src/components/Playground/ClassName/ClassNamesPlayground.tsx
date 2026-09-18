import { useMemo, useState } from "react";
import classNames from "./classNames";

const algorithm = `export default function classNames(...args) {
  const res = [];

  const process = (item) => {
    if (!item) return;

    if (typeof item === "string" || typeof item === "number") {
      res.push(item);

    } else if (Array.isArray(item)) {
      for (const value of item) {
        if (value) {
          process(value);
        }
      }

    } else if (
      typeof item === "object" &&
      Object.getPrototypeOf(item) === Object.prototype
    ) {
      for (const key in item) {
        if (item[key]) {
          res.push(key);
        }
      }
    }
  };

  for (const item of args) {
    process(item);
  }

  return res.join(" ");
}`;

const ClassNamesPlayground = () => {
  const [isActive, setIsActive] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [size, setSize] = useState<"sm" | "md" | "lg">("md");
  const [useNestedArray, setUseNestedArray] = useState(true);

  const classes = useMemo(
    () =>
      classNames(
        "btn",
        "transition-all",
        {
          "btn-primary": isActive,
          "btn-disabled": isDisabled,
        },
        [`btn-${size}`, useNestedArray && ["hover:scale-105", ["shadow-lg"]]],
      ),
    [isActive, isDisabled, size, useNestedArray],
  );

  return (
    <div className="min-h-screen bg-base-200 p-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">classNames Playground</h1>

          <p className="mt-2 text-base-content/70">
            Experiment with strings, objects, arrays, and nested arrays.
          </p>
        </div>

        {/* Playground */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Controls */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4">Test Inputs</h2>

              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Active</span>

                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                  />
                </label>
              </div>

              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Disabled</span>

                  <input
                    type="checkbox"
                    className="toggle toggle-error"
                    checked={isDisabled}
                    onChange={(e) => setIsDisabled(e.target.checked)}
                  />
                </label>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Size</span>
                </label>

                <select
                  className="select select-bordered w-full"
                  value={size}
                  onChange={(e) =>
                    setSize(e.target.value as "sm" | "md" | "lg")
                  }
                >
                  <option value="sm">Small</option>
                  <option value="md">Medium</option>
                  <option value="lg">Large</option>
                </select>
              </div>

              <div className="form-control mt-4">
                <label className="label cursor-pointer">
                  <span className="label-text">Nested arrays</span>

                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    checked={useNestedArray}
                    onChange={(e) => setUseNestedArray(e.target.checked)}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Result */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4">Result</h2>

              <div className="rounded-lg bg-neutral p-4">
                <code className="break-all text-sm text-neutral-content">
                  {classes}
                </code>
              </div>

              <div className="divider" />

              <div className="flex min-h-32 items-center justify-center rounded-lg bg-base-200">
                <button className={classes}>Test Button</button>
              </div>
            </div>
          </div>
        </div>

        {/* Examples */}
        <div className="card mt-6 bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">What is being tested?</h2>

            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Input</th>
                    <th>Purpose</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>
                      <code>"btn"</code>
                    </td>
                    <td>String values</td>
                  </tr>

                  <tr>
                    <td>
                      <code>{"{ 'btn-primary': isActive }"}</code>
                    </td>
                    <td>Conditional object classes</td>
                  </tr>

                  <tr>
                    <td>
                      <code>{`["btn-${size}"]`}</code>
                    </td>
                    <td>Array values</td>
                  </tr>

                  <tr>
                    <td>
                      <code>{`["hover:scale-105", ["shadow-lg"]]`}</code>
                    </td>
                    <td>Recursively nested arrays</td>
                  </tr>

                  <tr>
                    <td>
                      <code>false, null, undefined</code>
                    </td>
                    <td>Falsy values are ignored</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Algorithm */}
        <div className="card mt-6 bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="mb-4">
              <h2 className="card-title">Algorithm</h2>

              <p className="mt-2 text-sm text-base-content/70">
                The algorithm recursively processes each argument based on its
                type.
              </p>
            </div>

            <div className="mockup-code overflow-x-auto">
              <pre className="px-6 py-6 text-sm leading-6">
                <code>{algorithm}</code>
              </pre>
            </div>

            {/* Algorithm steps */}
            <div className="mt-6 grid gap-4 md:grid-cols-4">
              <div className="rounded-lg bg-base-200 p-4">
                <div className="badge badge-primary mb-2">1</div>

                <h3 className="font-semibold">Ignore falsy values</h3>

                <p className="mt-1 text-sm text-base-content/70">
                  null, undefined, false, 0, and empty strings are ignored.
                </p>
              </div>

              <div className="rounded-lg bg-base-200 p-4">
                <div className="badge badge-primary mb-2">2</div>

                <h3 className="font-semibold">Add strings/numbers</h3>

                <p className="mt-1 text-sm text-base-content/70">
                  Strings and numbers are added directly to the result.
                </p>
              </div>

              <div className="rounded-lg bg-base-200 p-4">
                <div className="badge badge-primary mb-2">3</div>

                <h3 className="font-semibold">Recursively process arrays</h3>

                <p className="mt-1 text-sm text-base-content/70">
                  Nested arrays are processed using the same function.
                </p>
              </div>

              <div className="rounded-lg bg-base-200 p-4">
                <div className="badge badge-primary mb-2">4</div>

                <h3 className="font-semibold">Process objects</h3>

                <p className="mt-1 text-sm text-base-content/70">
                  Object keys are added when their values are truthy.
                </p>
              </div>
            </div>

            {/* Example flow */}
            <div className="mt-6">
              <h3 className="mb-3 font-semibold">Example execution</h3>

              <div className="rounded-lg bg-neutral p-4 font-mono text-sm text-neutral-content">
                <div>
                  classNames(
                  <span className="text-warning">"a"</span>, [
                  <span className="text-warning">"b"</span>, [
                  <span className="text-warning">"c"</span>, {"{"} d: true {"}"}
                  ]])
                </div>

                <div className="my-2 text-base-content/50">↓</div>

                <div>
                  <span className="text-success">"a b c d"</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ClassNamesPlayground;
