import { useState } from "react";

type TrieNode = {
  children: Map<string, TrieNode>;
  isEndOfWord: boolean;
};

const WordDictionary = () => {
  const [word, setWord] = useState("");
  const [searchWord, setSearchWord] = useState("");

  const [words, setWords] = useState<string[]>([]);
  const [result, setResult] = useState<boolean | null>(null);

  const createTrieNode = (): TrieNode => ({
    children: new Map<string, TrieNode>(),
    isEndOfWord: false,
  });
  const [root] = useState<TrieNode>(() => createTrieNode());

  const addWord = (root: TrieNode, word: string) => {
    let currentNode = root;
    for (const char of word) {
      if (!currentNode.children.has(char)) {
        currentNode.children.set(char, createTrieNode());
      }
      currentNode = currentNode.children.get(char)!;
    }
    currentNode.isEndOfWord = true;
  };

  const search = (root: TrieNode, word: string): boolean => {
    const dfs = (index: number, node: TrieNode): boolean => {
      if (index === word.length) {
        return node.isEndOfWord;
      }

      const char = word[index];

      if (char === ".") {
        for (const childNode of node.children.values()) {
          if (dfs(index + 1, childNode)) {
            return true;
          }
        }

        return false;
      }

      const nextNode = node.children.get(char);

      return nextNode ? dfs(index + 1, nextNode) : false;
    };

    return dfs(0, root);
  };

  const handleAddWord = () => {
    if (!word.trim()) return;

    addWord(root, word.trim().toLowerCase());

    setWords((prev) => [...prev, word.trim().toLowerCase()]);
    setWord("");
  };

  const handleSearch = () => {
    if (!searchWord.trim()) return;

    const found = search(root, searchWord.trim().toLowerCase());

    setResult(found);
  };

  return (
    <main className="mx-auto max-w-2xl px-5 py-10">
      <h1 className="mb-6 text-3xl font-bold">Trie Word Dictionary</h1>

      {/* Add Word */}
      <section className="card mb-5 border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title">Add Word</h2>

          <div className="flex gap-2">
            <input
              value={word}
              onChange={(e) => setWord(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddWord();
                }
              }}
              placeholder="Enter a word..."
              className="input input-bordered w-full"
            />

            <button onClick={handleAddWord} className="btn">
              Add Word
            </button>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="card mb-5 border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title">Search</h2>

          <p className="text-base-content/70 leading-relaxed">
            Use <code className="badge badge-ghost">.</code> as a wildcard.
            <br />
            For example: <code className="badge badge-ghost">b..</code> matches
            "bad", "bed", etc.
          </p>

          <div className="flex gap-2">
            <input
              value={searchWord}
              onChange={(e) => {
                setSearchWord(e.target.value);
                setResult(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              placeholder="Search word..."
              className="input input-bordered w-full"
            />

            <button onClick={handleSearch} className="btn">
              Search
            </button>
          </div>

          {result !== null && (
            <div
              className={`alert mt-4 ${
                result ? "alert-success" : "alert-error"
              }`}
            >
              <span>
                {result
                  ? `✓ "${searchWord}" was found`
                  : `✕ "${searchWord}" was not found`}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Words */}
      <section className="card mb-5 border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title">Added Words</h2>

          {words.length === 0 ? (
            <p className="text-base-content/70 leading-relaxed">
              No words added yet.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {words.map((item, index) => (
                <span key={index} className="badge badge-ghost px-3 py-3">
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};
export default WordDictionary;
