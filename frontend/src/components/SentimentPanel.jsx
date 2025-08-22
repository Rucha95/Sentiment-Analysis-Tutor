import React, { useMemo,useState } from 'react'

function pretty(score){
  const clamped = Math.max(-3, Math.min(3, score))
  return (clamped + 3)/6
}

export default function SentimentPanel({ 
  score=0, 
  label='—', 
  posneg={pos:0,neg:0}, 
  model='rule', 
  question=" ", 
  answer=" " 
}){
  const pct = useMemo(()=> pretty(score), [score])
  return (
    <div className="analysis">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:8}}>
        <div className="label">Live Analyzer</div>
        <div style={{fontSize:12, opacity:.8}}>
          Model: <b>{model==='rule'?'Rule':'Alt'}</b>
        </div>
      </div>
      <div className="meter" aria-hidden>
        <div className="fill" style={{ transform:`scaleX(${pct})` }} />
      </div>
      <div className="legend">
        <span>😟 Negative</span>
        <span style={{marginLeft:'auto'}}>😊 Positive</span>
      </div>
      <p style={{marginTop:6}}>Prediction: <b>{label}</b> (score {score.toFixed(2)})</p>
      <p style={{marginTop:0, fontSize:14, opacity:.8}}>Word counts : +{posneg.pos} / -{posneg.neg}</p>
      <details>
        <summary style={{cursor:'pointer'}}>{question}</summary>
        <p style={{marginTop:8}}>{answer}</p>
      </details>
    </div>
  )
}
