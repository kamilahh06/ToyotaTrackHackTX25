import React, { useState } from "react";

export default function CarRecommendation() {
  const [form, setForm] = useState({
    income: "",
    creditScore: "",
    lifestyle: "",
    preferredType: "",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await fetch("http://localhost:5000/api/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="recommendation">
      <h2>Find Your Toyota Match</h2>
      <form onSubmit={handleSubmit}>
        <input name="income" placeholder="Income" onChange={handleChange} />
        <input name="creditScore" placeholder="Credit Score" onChange={handleChange} />
        <input name="lifestyle" placeholder="Lifestyle (e.g., student, family)" onChange={handleChange} />
        <input name="preferredType" placeholder="Preferred Type (SUV, Sedan, etc.)" onChange={handleChange} />
        <button type="submit">{loading ? "Loading..." : "Get Recommendation"}</button>
      </form>

      {result && (
        <div className="results">
          <h3>AI Recommendation</h3>
          <p>{result.recommendation}</p>
          <h4>Models Considered:</h4>
          <ul>
            {result.models?.map((m, i) => (
              <li key={i}>{m.name} – ${m.price}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}