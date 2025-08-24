import { useNavigate } from "react-router-dom";
import modernFamily from "../images/modern-family.webp";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <div className="landing-img" >
  <img 
    src={modernFamily} 
    alt="Modern Family" 
    style={{ 
      width: "100%", 
      height: "100%", 
      borderRadius: "35px",
      objectFit: "cover" 
    }}
  />
</div>
      <button className="ready-btn" onClick={() => navigate("/explore")} style={{ marginTop: "20px" }}>
      Ready to explore Sentiment Analysis?
      </button>
    </div>
  );
}
