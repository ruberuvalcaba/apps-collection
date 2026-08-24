//                 DATA
//                  │
//                  ▼
//           Normalize once
//                  │
//                  ▼
//           ┌──────────────┐
//           │ users        │
//           │ searchName   │
//           │ searchEmail  │
//           └──────────────┘
//                  │
//                  ▼
//           User types
//                  │
//                  ▼
//              Debounce
//                  │
//                  ▼
//              useMemo
//                  │
//                  ▼
//              Filter
//                  │
//                  ▼
//            Render result

import { useEffect, useMemo, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
};

const generateUsers = (count: number): User[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `User ${index + 1}`,
    email: `user${index + 1}@example.com`,
  }));
};

const USERS = generateUsers(10_000);

const MemoizationIndexingSearch = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // -----------------------------------------
  // Step 1: Debounce the search input
  // -----------------------------------------
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // -----------------------------------------
  // Step 2: Normalize/index the data once
  // -----------------------------------------
  const normalizedUsers = useMemo(() => {
    console.log("🔨 Building normalized index...");

    return USERS.map((user) => ({
      ...user,
      searchName: user.name.toLowerCase(),
      searchEmail: user.email.toLowerCase(),
    }));
  }, []);

  // -----------------------------------------
  // Step 3: Memoized filtering
  // -----------------------------------------
  const filteredUsers = useMemo(() => {
    console.log("🔍 Filtering users...");

    const query = debouncedSearch.toLowerCase().trim();

    if (!query) {
      return normalizedUsers;
    }

    return normalizedUsers.filter(
      (user) =>
        user.searchName.includes(query) || user.searchEmail.includes(query),
    );
  }, [normalizedUsers, debouncedSearch]);

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-2 text-2xl font-bold">Memoization + Indexing Test</h1>

      <p className="mb-6 text-base-content/70">Search through 10,000 users.</p>

      {/* Search */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search users..."
        className="input input-bordered mb-4 w-full"
      />

      {/* Stats */}
      <div className="stats mb-6 w-full shadow">
        <div className="stat">
          <div className="stat-title">Users</div>
          <div className="stat-value text-2xl">
            {USERS.length.toLocaleString()}
          </div>
        </div>

        <div className="stat">
          <div className="stat-title">Results</div>
          <div className="stat-value text-2xl">
            {filteredUsers.length.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-2">
        {filteredUsers.slice(0, 50).map((user) => (
          <div key={user.id} className="rounded-lg border border-base-300 p-3">
            <div className="font-medium">{user.name}</div>
            <div className="text-sm text-base-content/60">{user.email}</div>
          </div>
        ))}

        {filteredUsers.length > 50 && (
          <p className="pt-3 text-sm text-base-content/60">
            Showing first 50 results...
          </p>
        )}
      </div>
    </main>
  );
};

export default MemoizationIndexingSearch;
