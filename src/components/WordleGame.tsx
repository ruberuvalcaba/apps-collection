import { useState, useEffect } from "react";

const WORD_LENGTH = 5;
const MAX_GUESSES = 5;

/**
 * const elements = Array.from(document.querySelectorAll('[data-id] [data-class] [data-tag] .ref'));
 * const vals = elements.map(el => el.getAttribute('value'))
 * vals.join('')
 */

const WordleGame = () => {
  const [secretWord, setSecretWord] = useState("");
  const [loading, setLoading] = useState(true);
  const [guesses, setGuesses] = useState(Array(MAX_GUESSES).fill(""));
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch secret word from API
  useEffect(() => {
    const fetchSecretWord = () => {
      setLoading(true);
      fetch(
        "https://wgg522pwivhvi5gqsn675gth3q0otdja.lambda-url.us-east-1.on.aws/656d61",
      )
        .then((response) => response.text())
        .then((data) => {
          setSecretWord(data.toUpperCase());
        })
        .catch((err) => console.error("Error fetching data: ", err));
      setLoading(false);
    };
    fetchSecretWord();
  }, []);

  // Handle user input submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (gameOver || currentGuess.length !== WORD_LENGTH) return;

    const newGuesses = [...guesses];
    const guessIndex = guesses.findIndex((g) => g === "");
    newGuesses[guessIndex] = currentGuess.toUpperCase();
    setGuesses(newGuesses);
    setCurrentGuess("");

    // Check win
    if (currentGuess.toUpperCase() === secretWord) {
      setMessage("You've won!");
      setGameOver(true);
      return;
    }

    // Check loss
    if (guessIndex === MAX_GUESSES - 1) {
      setMessage(`You've lost! Secret word was "${secretWord}"`);
      setGameOver(true);
    }
  };

  const getCellColor = (char: string, idx: number) => {
    const character = char?.toUpperCase();
    if (!character) return "bg-white";
    if (character === secretWord[idx]) return "bg-green-500";
    if (secretWord.includes(character)) return "bg-yellow-500";
    return "bg-red-500";
  };

  return loading ? (
    <h2>Loading...</h2>
  ) : (
    <div>
      <div className="grid grid-cols-5 gap-4 w-full max-w-48">
        {guesses.map((guess) =>
          guess
            .split("")
            .concat(Array(5 - guess.length).fill(""))
            .map((char: string, idx: number) => (
              <div
                key={idx}
                className={`border text-center w-7 h-7 ${getCellColor(char, idx)}`}
              >
                {char}
              </div>
            )),
        )}
      </div>

      {!gameOver && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="input mt-5"
            value={currentGuess}
            placeholder="Type your guess"
            onChange={(e) => setCurrentGuess(e.target.value.slice(0, 5))}
            disabled={gameOver}
          />
          <button type="submit" className="btn">
            Guess
          </button>
        </form>
      )}
      {message && <h2>{message}</h2>}
    </div>
  );
};

export default WordleGame;
