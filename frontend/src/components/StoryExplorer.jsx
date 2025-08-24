import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import StoryPanel from "./StoryPanel.jsx";
import SentimentPanel from "./SentimentPanel.jsx";
import Quiz from "./Quiz.jsx";

const API_URL = import.meta.env.VITE_API_URL ||  "/api";

const STORY = [
  { who:'Grandma', text:'When I was your age, I loved visiting the sunny market with bright flowers and friendly faces everywhere!' },
  { who:'Granddaughter', text:'That sounds fun, Grandma! Did you buy yummy mangoes? 😀' },
  { who:'Grandma', text:'Oh yes, the mangoes were so tasty and the air smelled sweet. But one day, a dark storm came and the wind sounded angry.' },
  { who:'Grandma', text:'I felt a bit scared, but a kind shopkeeper said, "Do not worry!" He gave me a warm, cozy scarf.' },
  { who:'Granddaughter', text:'So even though the clouds were gloomy, people were helpful and brave!' },
  { who:'Grandma', text:'Exactly! We waited together. Soon the clouds moved away, and everyone cheered with happy smiles!' },
  { who:'Granddaughter', text:'That makes me feel proud of kind people. But what if it never stopped raining?' },
  { who:'Grandma', text:'Even then, we would hold hands, share tasty snacks, and tell jokes so no one felt lonely!' }
];

const QA_DATA = [
    {
        question:"What does the Analyzer do?", 
        answer:"It is a computer program that reads a sentence and decides if the overall feeling is positive, negative, or neutral. Different models can perform different types of sentiment analysis." 
    },
    {
      question: "What is the Rule model?",
      answer: "It checks for words, boosters (like very), negations (like not), punctuation, and emojis to get the prediction score. A higher score means the text is more positive, while a lower score means it’s more negative."
    },
    {
      question: "What is the Alt model?",
      answer: "It is an alternative model designed to only look for positive and negative words to get the score. More positive words in the text lead to increasing the score while more negative words lead to decreasing the score. It is faster but less accurate than the Rule model."
    },
    {
      question: "What are POSITIVE and NEGATIVE words?",
      answer: "They are like two big boxes of words. The positive box has happy words like love, fun, smile. The negative box has sad words like cry, angry, sick. The sentiment analyzer checks which box your words fall into."
    },
    {
      question: "What are NEGATIONS?",
      answer: "Negations are words like not, never, don't. They change the meaning. If you say not happy, it is actually sad. The sentiment analyzer looks at these words carefully to change the feeling correctly."
    },
    {
      question: "What are BOOSTERS?",
      answer: "Boosters make feelings stronger. Words like very, super, really act like a loud speaker for emotions. Saying 'very happy' is more powerful than just 'happy', so the score goes up more."
    },
    {
      question: "Does the analyzer understand EMOJIS?",
      answer: "Emojis are like tiny pictures of feelings! 😀 means happy, 😢 means sad. The sentiment analyzer adds or subtracts points when it sees these emojis, because they tell a lot about emotions."
    },
    {
      question: "How does the prediction score work?",
      answer: "The score depends on which model you use for sentiment analysis. Every happy word adds a point, every sad word takes away a point. Boosters make the points bigger, negations change them, and emojis or '!' changes the score too."
    },
    {
      question: "What happens after scoring?",
      answer: "Once the score is ready, the computer gives a label: 'Positive' if it's mostly happy, 'Negative' if it's mostly sad, and 'Mixed/Neutral' if it's in between. It's like a mood detector for text."
    }
  ]
  

export default function StoryExplorer() {
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState([]);
  const [model, setModel] = useState("rule");
  const railRef = useRef(null);
  const navigate = useNavigate();
  const [showPredictions, setShowPredictions] = useState(false);

  const visible = STORY.slice(0, index + 1).map((x) => x.text);

  useEffect(() => {
    async function fetchAll() {
      try {
        const res = await fetch(API_URL + "/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paragraphs: STORY.map((x) => x.text) }),
        });
        const json = await res.json();
        setResults(json.results || []);
      } catch (e) {
        console.error(e);
      }
    }
    fetchAll();
  }, []);

  const current = results[index] || null;
  const label = current && showPredictions ? current[model].label : "—";
  const score = current && showPredictions ? current[model].score : 0;
  const posneg =
    current && showPredictions && current.alt
      ? { pos: current.alt.pos, neg: current.alt.neg }
      : { pos: 0, neg: 0 };


  function next() {
    setIndex((i) => Math.min(i + 1, STORY.length));
    setTimeout(() => {
      if (railRef.current) {
        railRef.current.scrollTo({
          left: railRef.current.scrollWidth,
          behavior: "smooth",
        });
      }
    }, 50);
  }
  function prev() {
    setIndex((i) => Math.max(0, i - 1));
    setTimeout(() => {
      if (railRef.current) {
        railRef.current.scrollBy({ left: -500, behavior: "smooth" });
      }
    }, 50);
  }

  return (
    <div className="app-shell">
      <header className="header">
        <div className="brand">
          <div className="logo">SA</div>
          <div>Grandma's Story Sentiment Explorer</div>
        </div>
        <div className="header-actions">
          <button className="btn home" onClick={() => navigate("/")}>
            ⬅ Home
          </button>
        </div>
      </header>

      <section className="hero">
        <h1>Let's Dive into Sentiment Analysis!</h1>
        <p>
        Discover how computers can understand emotions in text — sentiment analysis lets you teach machines to recognize happiness, sadness, and everything in between!</p>
        <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "center" }}>
        <button
  className={`btn btn-large ${
    !showPredictions ? "btn-neutral" : model === "rule" ? "btn-rule" : "btn-alt"
  }`}
  onClick={() => {
    if (!showPredictions) {
      setShowPredictions(true)
      setModel("rule") 
    } else {
      setModel((m) => (m === "rule" ? "alt" : "rule"))
    }
  }}
>
  {!showPredictions
    ? "Run Analysis"
    : `Switch to ${model === "rule" ? "Alt" : "Rule"} Model`}
</button>
        </div>
        



        {/* Click <button className="btn" onClick={() => setShowPredictions(true)}>
             Show Predictions
          </button> to see the mood analysis.<button className="btn alt" onClick={() => setModel((m) => (m === "rule" ? "alt" : "rule"))}>
            Switch to {model === "rule" ? "Alt" : "Rule"} Model
          </button>  */}
        
      </section>

      <div className="rail" ref={railRef}>
        {STORY.slice(0, index + 1).map((chunk, i) => (
          <div className="panel" key={i}>
            <StoryPanel who={chunk.who} text={chunk.text} i={i} />
            <SentimentPanel
              score={results[i] && showPredictions ? results[i][model].score : 0}
              label={results[i] && showPredictions ? results[i][model].label : "—"}
              posneg={
                results[i] && showPredictions && results[i].alt
                  ? { pos: results[i].alt.pos, neg: results[i].alt.neg }
                  : { pos: 0, neg: 0 }
              }
              model={!showPredictions ? "not_selected" :model}
              question={QA_DATA[i % QA_DATA.length].question}
              answer={QA_DATA[i % QA_DATA.length].answer}
            />
          </div>
        ))}

        {index >= STORY.length - 1 && (
          <div className="panel" style={{ gridTemplateColumns: "1fr" }}>
            <Quiz />
          </div>
        )}
      </div>

      <div className="controls">
        <button className="btn" onClick={prev} disabled={index === 0}>
          ◀ Prev
        </button>
        <div className="speaker badge">
          Panel {Math.min(index + 1, STORY.length)} / {STORY.length}
        </div>
        <button className="btn" onClick={next} disabled={index >= STORY.length - 1}>
          Next ▶
        </button>
      </div>

      <footer className="footer">
      Landing Image Credits: <a>Modern Family</a> • © {new Date().getFullYear()} • Rule-based and an alternative sentiment model for Text analysis • <a href="https://www.linkedin.com/in/rucha-chauthai-733013194/" target="_blank"> LinkedIn</a>
      </footer>
    </div>
  );
}
