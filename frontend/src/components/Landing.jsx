import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <img
        src="/src/images/modern-family.webp"
        alt="Sentiment Analysis Intro"
        className="landing-img"
      />
      <button className="ready-btn" onClick={() => navigate("/explore")}>
      Ready to explore Sentiment Analysis?
      </button>
    </div>
  );
}
