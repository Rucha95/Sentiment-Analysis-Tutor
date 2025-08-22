import React from 'react'

export default function StoryPanel({ who, text, i }){
  return (
    <div>
      <div className="scene">
      <div className="character">
      <div className={who === "Grandma" ? "grandma" : who === "Granddaughter" ? "girl" : ""}></div>
      </div>
      </div>
      <div className="speech" role="region" aria-label={`${who} says`}>
        <h3>{who} says:</h3>
        <p>{text}</p>
      </div>
    </div>
  )
}
