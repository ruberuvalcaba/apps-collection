type ClassValue =
  | string
  | number
  | null
  | undefined
  | boolean
  | ClassValue[]
  | Record<string, boolean>;

export default function classNames(...args: ClassValue[]): string {
  const res: (string | number)[] = [];

  const process = (item: ClassValue): void => {
    if (!item) return;

    if (typeof item === "string" || typeof item === "number") {
      res.push(item);
    } else if (Array.isArray(item)) {
      for (const value of item) {
        process(value);
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
}