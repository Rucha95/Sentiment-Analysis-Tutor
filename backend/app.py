from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import re

app = FastAPI(
    title="Sentiment Analysis API",
    description="Rule-based and an alternative approach for sentiment analysis",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

POSITIVE = {
    "happy","joy","great","good","love","like","kind","brave","fun","smile","cheerful","proud",
    "friendly","calm","peace","beautiful","help","helpful","amazing","bright","delight","excited",
    "glad","wonderful","win","safe","care","caring","sweet","cozy","warm","tasty","yummy"
}
NEGATIVE = {
    "sad","bad","angry","hate","scared","fear","storm","dark","cry","worry","worried","lose",
    "hurt","pain","mean","rude","lonely","cold","hungry","tired","ugly","broken","fail","danger",
    "unsafe","noisy","scream","shout","stormy","gloomy","bored","sick","ill"
}
NEGATIONS = {"not","never","no","hardly","barely","scarcely","isn't","wasn't","aren't","don't","doesn't","didn't","won't","can't"}
BOOSTERS = {"very":1.5, "extremely":2.0, "really":1.3, "super":1.6, "so":1.2}
EMOJI_POS = {"😀","😄","😊","😍","🥳","👍","❤️","✨"}
EMOJI_NEG = {"😞","😢","😭","😡","👎","💔","😨","☔"}

word_re = re.compile(r"[A-Za-z']+")

class AnalyzeRequest(BaseModel):
    paragraphs: list[str]

def tokenize(text: str):
    return [w.lower() for w in word_re.findall(text)]

def rule_score(text: str) -> dict:
    tokens = tokenize(text)
    score = 0.0
    
    for i, w in enumerate(tokens):
        mult = 1.0
        
        if i > 0 and tokens[i-1] in BOOSTERS:
            mult *= BOOSTERS[tokens[i-1]]
        
        if any(tokens[j] in NEGATIONS for j in range(max(0, i-2), i)):
            mult *= -1.0
        if w in POSITIVE:
            score += 1.0 * mult
        elif w in NEGATIVE:
            score -= 1.0 * mult

    
    if "!" in text:
        exclam_count = text.count("!")
        score += 0.2 * exclam_count if score > 0 else -0.2 * exclam_count

    for ch in text:
        if ch in EMOJI_POS: score += 0.5
        if ch in EMOJI_NEG: score -= 0.5

    return {"score": score}

def alt_simple_score(text: str) -> dict:
    """Alternative simple approach:
    - Count positive/negative words without negation.
    - Add punctuation/length heuristics (question marks reduce certainty).
    - Designed to show that different rules give slightly different results.
    """
    tokens = tokenize(text)
    pos = sum(1 for w in tokens if w in POSITIVE)
    neg = sum(1 for w in tokens if w in NEGATIVE)
    score = pos - neg
  
    q = text.count("?")
    if q:
        score *= max(0.4, 1 - 0.2*q)
    
    commas = text.count(",")
    if commas >= 2: score *= 0.9
    return {"score": float(score), "pos": pos, "neg": neg}

def label_from_score(s: float) -> str:
    if s > 0.6: return "Positive"
    if s < -0.6: return "Negative"
    return "Mixed/Neutral"

@app.post("/analyze")
def analyze(req: AnalyzeRequest):
    results = []
    for p in req.paragraphs:
        r1 = rule_score(p)
        r2 = alt_simple_score(p)
        results.append({
            "paragraph": p,
            "rule": {"score": r1["score"], "label": label_from_score(r1["score"])},
            "alt": {"score": r2["score"], "label": label_from_score(r2["score"]), "pos": r2["pos"], "neg": r2["neg"]}
        })
    return {"results": results}
