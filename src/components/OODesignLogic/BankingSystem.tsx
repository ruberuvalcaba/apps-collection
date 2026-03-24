import { useState } from "react";
import Description from "./Description";

const BankingSystem = () => {
  //   const accounts = new Map<string, { owner: string; balance: number }>();
  const [accounts, setAccounts] = useState<
    Map<string, { owner: string; balance: number }>
  >(new Map());
  const [message, setMessage] = useState<string>("");
  const [value, setValue] = useState<Record<string, string>>({});
  const [action, setAction] = useState<
    "create" | "deposit" | "withdraw" | "transfer"
  >("create");

  const validateIdAndAmount = (accountId: string, amount: number) => {
    if (!accountId) {
      setMessage("Account ID cannot be empty");
      return false;
    }
    if (amount < 0) {
      setMessage("Amount cannot be negative");
      return false;
    }
    return true;
  };

  const createAccount = (
    accountId: string,
    owner: string,
    initialDeposit: number = 0,
  ) => {
    if (!validateIdAndAmount(accountId, initialDeposit)) return;
    if (accounts.has(accountId))
      return setMessage("Account with this ID already exists");
    // accounts.set(accountId, { owner, balance: initialDeposit });
    setAccounts((prev) => {
      const next = new Map(prev);
      next.set(accountId, { owner, balance: initialDeposit || 0 });
      return next;
    });
  };

  const deposit = (accountId: string, amount: number) => {
    if (!validateIdAndAmount(accountId, amount)) return;
    const account = accounts.get(accountId);
    if (!account) return setMessage("Account not found");

    // account.balance += amount;
    setAccounts((prev) => {
      const next = new Map(prev);
      next.set(accountId, { ...account, balance: account.balance + amount });
      return next;
    });
  };

  const withdraw = (accountId: string, amount: number) => {
    if (!validateIdAndAmount(accountId, amount)) return;
    const account = accounts.get(accountId);
    if (!account) return setMessage("Account not found");
    if (account.balance < amount)
      return setMessage("Insufficient funds for withdrawal");

    // account.balance -= amount;
    setAccounts((prev) => {
      const next = new Map(prev);
      next.set(accountId, { ...account, balance: account.balance - amount });
      return next;
    });
  };

  const transfer = (
    fromAccountId: string,
    toAccountId: string,
    amount: number,
  ) => {
    if (!validateIdAndAmount(fromAccountId, amount) || !toAccountId) return;
    const fromAccount = accounts.get(fromAccountId);
    const toAccount = accounts.get(toAccountId);
    if (!fromAccount) return setMessage("From account not found");
    if (!toAccount) return setMessage("To account not found");
    if (fromAccount.balance < amount)
      return setMessage("Insufficient funds for transfer");

    // fromAccount.balance -= amount;
    // toAccount.balance += amount;
    setAccounts((prev) => {
      const next = new Map(prev);
      next.set(fromAccountId, {
        ...fromAccount,
        balance: fromAccount.balance - amount,
      });
      next.set(toAccountId, {
        ...toAccount,
        balance: toAccount.balance + amount,
      });
      return next;
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValue((prev) => ({ ...prev, [name]: value }));
  };

  const handleAction = () => {
    if (action === "create") {
      console.log("here");
      createAccount(value.originAccountId, value.owner, Number(value.amount));
    } else if (action === "deposit") {
      deposit(value.originAccountId, Number(value.amount));
    } else if (action === "withdraw") {
      withdraw(value.originAccountId, Number(value.amount));
    } else if (action === "transfer") {
      transfer(
        value.originAccountId,
        value.destinationAccountId,
        Number(value.amount),
      );
    }
    setValue({});
  };

  return (
    <div className="flex gap-10">
      <div>
        <Description appDescription="Implement a banking system class that handles account creation, deposits, withdrawals, and transfers between users." />
        <fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-64 border p-4">
          <legend className="fieldset-legend">Action options</legend>
          <label className="label">
            <input
              type="checkbox"
              checked={action === "create"}
              onChange={() => setAction("create")}
              className="toggle"
            />
            Create Account
          </label>
          <label className="label">
            <input
              type="checkbox"
              checked={action === "deposit"}
              onChange={() => setAction("deposit")}
              className="toggle"
            />
            Make a Deposit
          </label>
          <label className="label">
            <input
              type="checkbox"
              checked={action === "withdraw"}
              onChange={() => setAction("withdraw")}
              className="toggle"
            />
            Withdraw
          </label>
          <label className="label">
            <input
              type="checkbox"
              checked={action === "transfer"}
              onChange={() => setAction("transfer")}
              className="toggle"
            />
            Transfer
          </label>
        </fieldset>
        <div className="my-5">
          <input
            className="input w-55 mr-3"
            type="text"
            placeholder={`${action === "transfer" ? "Enter origin account ID" : "Enter account ID"}`}
            name="originAccountId"
            value={value.originAccountId || ""}
            onChange={handleInputChange}
          />
          <input
            className="input w-55 mr-3"
            type="text"
            placeholder={`${action === "transfer" ? "Enter destination account ID" : "Enter account ID"}`}
            name="destinationAccountId"
            value={value.destinationAccountId || ""}
            hidden={action !== "transfer"}
            onChange={handleInputChange}
          />
          <input
            className="input w-55 mr-3"
            type="text"
            placeholder="Enter owner name"
            name="owner"
            value={value.owner || ""}
            hidden={action !== "create"}
            onChange={handleInputChange}
          />
          <input
            className="input w-40 mr-3"
            type="number"
            placeholder={`${action === "create" ? "Enter initial amount" : "Enter amount"}`}
            name="amount"
            value={value.amount || ""}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <button className="btn mr-3" onClick={() => handleAction()}>
            Submit
          </button>
        </div>
        <p>{message}</p>
      </div>
      <div>
        <h3 className="text-2xl font-bold mb-4">Accounts</h3>
        <table className="table w-full">
          <thead>
            <tr>
              <th>Account ID</th>
              <th>Owner</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {Array.from(accounts.entries()).map(([id, { owner, balance }]) => (
              <tr key={id}>
                <td>{id}</td>
                <td>{owner}</td>
                <td>${balance.toFixed(2) || "0.00"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BankingSystem;
