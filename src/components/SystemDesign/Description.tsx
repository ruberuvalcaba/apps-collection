const Description = ({ appDescription }: { appDescription: string }) => {
  return (
    <div className="mb-10">
      <p className="mb-5">
        <p className="mb-5">
          <strong>App description: </strong>
          {appDescription}
        </p>
      </p>
      <h2 className="mb-3">System Design (Senior Roles) Considerations</h2>
      <ul className="list-disc list-inside mb-5">
        <li>
          <strong>Database Schema Design</strong> – Choosing between SQL vs.
          NoSQL (Postgres is heavily used at Ramp) and modeling relationships.
        </li>
        <li>
          <strong>API Design</strong> – Designing RESTful or GraphQL endpoints
          that are clean and idempotent.
        </li>
        <li>
          <strong>Scalability & Reliability</strong> – Handling high throughput,
          ensuring zero data loss, and managing distributed transactions.
        </li>
        <li>
          <strong>Past Experience Deep Dive</strong> – Being able to explain the
          architecture of a system you previously built, including the "why"
          behind your technology choices.
        </li>
      </ul>
    </div>
  );
};

export default Description;
