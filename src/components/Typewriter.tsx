import { useEffect, useState } from "react";

const Typewriter = () => {
  const [data, setData] = useState<{ id: number; text: string }[]>([]);
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // fetch("/api/data")
    //   .then((res) => res.json())
    //   .then((data) => setData(data || "Hola, soy el contenido del tab 1."));

    setData([
      { id: 1, text: "Hello" },
      { id: 2, text: "from" },
      { id: 3, text: "Ramp" },
    ]);
  }, []);

  useEffect(() => {
    if (data.length === 0) return;

    const fullText = data.map((d) => d.text).join(" ");

    if (index < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + fullText[index]);
        setIndex(index + 1);
      }, 50);

      return () => clearTimeout(timeout);
    }
  }, [index, data]);

  return <h1>{displayText}</h1>;
};
export default Typewriter;
