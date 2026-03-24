import { useState } from "react";
import Description from "./Description";

const InMemoryDB = () => {
  const [value, setValue] = useState<{
    key: string;
    value: string | number;
  }>({ key: "", value: "" });
  const [message, setMessage] = useState<string>("");
  const [db, setDb] = useState<Map<string, string | number>>(new Map());
  const [transactionLog, setTransactionLog] = useState<
    Array<{
      key: string;
      oldValue: string | number;
      newValue: string | number | undefined;
    }>
  >([]);
  //   const db = new Map<string, any>();
  //   const transactionLog: Array<{ key: string; oldValue: any; newValue: any }> =
  //     [];

  const clearValue = () => {
    setValue({ key: "", value: "" });
  };

  const set = (key: string, value: string | number) => {
    if (!key) return setMessage("Key cannot be empty on Set");
    const oldValue = db.get(key) ?? "";
    setTransactionLog((prev) => [...prev, { key, oldValue, newValue: value }]);
    // transactionLog.push({ key, oldValue, newValue: value });
    setMessage(`"${key}/${value}" added. Commit to apply changes.`);
    clearValue();
  };

  const get = (key: string) => {
    if (!key) return setMessage("Key cannot be empty on Get");
    clearValue();
    if (!db.has(key)) return setMessage("Key not found");
    setMessage(String(db.get(key))); // db.get(key) can return undefined, so we provide a default empty string
  };

  const del = (key: string) => {
    if (!key) return setMessage("Key cannot be empty on Delete");
    if (!db.has(key)) return setMessage("Key not found");
    const oldValue = db.get(key) ?? "";
    setTransactionLog((prev) => [
      ...prev,
      { key, oldValue, newValue: undefined },
    ]);
    setMessage(`Key "${key}" marked for deletion. Commit to apply changes.`);
    // transactionLog.push({ key, oldValue, newValue: undefined });
  };

  const commit = () => {
    if (transactionLog.length === 0)
      return setMessage("No active transaction to commit");
    for (const { key, newValue } of transactionLog) {
      if (newValue === undefined) {
        setDb((prev) => {
          const next = new Map(prev);
          next.delete(key);
          return next;
        });
        // db.delete(key); //Mutates the original Map - Can be use when not using useState
      } else {
        setDb((prev) => {
          const next = new Map(prev);
          next.set(key, newValue);
          return next;
        });
        // db.set(key, newValue); //Mutates the original Map - Can be use when not using useState
      }
    }
    setTransactionLog([]); // Clear the log after committing
    clearValue();
    // transactionLog.length = 0;
  };

  const rollback = () => {
    if (transactionLog.length === 0)
      return setMessage("No active transaction to rollback");
    setTransactionLog((prev) => prev.slice(0, -1)); // transactionLog.pop();
    clearValue();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValue((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <Description
        appDescription="In-memory database with support for set, get, and delete operations,
          along with transactional support (commit/rollback)."
      />
      {db.size > 0 && (
        <div className="mb-5">
          <h3 className="font-bold mb-2">Current DB State:</h3>
          <ul className="list-disc list-inside">
            {Array.from(db.entries()).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {value}
              </li>
            ))}
          </ul>
        </div>
      )}
      <input
        className="input mr-3"
        type="text"
        placeholder="Enter key"
        name="key"
        value={value.key}
        onChange={handleInputChange}
      />
      <input
        className="input"
        type="text"
        placeholder="Enter value"
        name="value"
        value={value.value}
        onChange={handleInputChange}
      />
      <div className="mt-5">
        <button
          className="btn mr-3"
          onClick={() => set(value.key, value.value)}
        >
          Set
        </button>
        <button className="btn mr-3" onClick={() => get(value.key)}>
          Get
        </button>
        <button className="btn mr-3" onClick={() => del(value.key)}>
          Delete
        </button>
        <button className="btn mr-3" onClick={commit}>
          Commit
        </button>
        <button className="btn mr-3" onClick={rollback}>
          Rollback
        </button>
      </div>
      <p className="mt-5">{message}</p>
    </div>
  );
};

export default InMemoryDB;
