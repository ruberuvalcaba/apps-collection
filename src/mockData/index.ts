import type { Column, User } from "../types";
export const mockColumsData: Column<User>[] = [
  { key: "id", header: "ID" },
  { key: "name", header: "Name", sortable: true, filterable: true },
  { key: "age", header: "Age", sortable: true },
  { key: "email", header: "Email", filterable: true },
  { key: "role", header: "Role", filterable: true },
  { key: "active", header: "Active", filterable: true },
];
export const mockRowsData: User[] = [
  {
    id: 1,
    name: "Alice Johnson",
    age: 28,
    email: "alice@example.com",
    role: "Engineer",
    active: true,
  },
  {
    id: 2,
    name: "Bob Smith",
    age: 35,
    email: "bob@example.com",
    role: "Manager",
    active: false,
  },
  {
    id: 3,
    name: "Charlie Brown",
    age: 22,
    email: "charlie@example.com",
    role: "Intern",
    active: true,
  },
  {
    id: 4,
    name: "Diana Prince",
    age: 30,
    email: "diana@example.com",
    role: "Designer",
    active: true,
  },
  {
    id: 5,
    name: "Ethan Hunt",
    age: 40,
    email: "ethan@example.com",
    role: "Engineer",
    active: false,
  },
  {
    id: 6,
    name: "Fiona Gallagher",
    age: 27,
    email: "fiona@example.com",
    role: "Engineer",
    active: true,
  },
  {
    id: 7,
    name: "George Martin",
    age: 35,
    email: "george@example.com",
    role: "Manager",
    active: true,
  },
  {
    id: 8,
    name: "Hannah Lee",
    age: 29,
    email: "hannah@example.com",
    role: "Designer",
    active: false,
  },
  {
    id: 9,
    name: "Ivan Petrov",
    age: 31,
    email: "ivan@example.com",
    role: "Engineer",
    active: true,
  },
  {
    id: 10,
    name: "Jane Doe",
    age: 28,
    email: "jane@example.com",
    role: "Engineer",
    active: true,
  },

  // Edge cases 👇
  {
    id: 11,
    name: "Alice Johnson", // duplicate name
    age: 28,
    email: "alice2@example.com",
    role: "Engineer",
    active: false,
  },
  {
    id: 12,
    name: null, // null value
    age: null,
    email: "unknown@example.com",
    role: "Unknown",
    active: false,
  },
];
