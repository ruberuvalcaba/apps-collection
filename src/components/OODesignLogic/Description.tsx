const Description = ({ appDescription }: { appDescription: string }) => {
  return (
    <div className="mb-10">
      <p className="mb-5">
        <strong>{appDescription}</strong>
      </p>
      <h2 className="mb-3">Object-Oriented Design & Logic</h2>
      <ul className="list-disc list-inside mb-5">
        <li>
          <strong>Class Design</strong> – Creating classes with proper
          encapsulation, methods, and properties.
        </li>
        <li>
          <strong>Data Structures</strong> – Using HashMaps (Dictionaries)
          effectively for lookups and storage.
        </li>
        <li>
          <strong>Business Logic Implementation</strong> – Translating a set of
          rules (e.g., banking transactions, calendar scheduling) into working
          code.
        </li>
        <li>
          <strong>Edge Cases</strong> – Handling invalid inputs, time-to-live
          (TTL) expiration, or concurrent modifications.
        </li>
      </ul>
    </div>
  );
};

export default Description;
