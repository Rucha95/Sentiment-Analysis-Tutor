import React, { useMemo, useState } from 'react'

const QUESTIONS = [
  {
    q: 'What does a rule-based model look for?',
    opts: ['Only emojis', 'Rules like positive/negative words, negations, boosters', 'Pictures in the story'],
    a: 1
  },
  {
    q: 'Which word can change meaning?',
    opts: ['very', 'not', 'mango'],
    a: 1
  },
  {
    q: 'If a sentence has many "!" and happy words, the score becomes...',
    opts: ['more positive', 'more negative', 'unchanged'],
    a: 0
  },
  {
    q: 'What does the Alt model mainly count?',
    opts: ['Nouns and verbs', 'Positive and negative words', 'Number of letters'],
    a: 1
  },
  {
    q: 'What of the followinf are applications of sentiment analysis?',
    opts: ['Social Media monitoring', 'Customer Support', 'Patient feedback','All of above'],
    a: 3
  }
]

export default function Quiz(){
  const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(null))
  const [submitted, setSubmitted] = useState(false)

  const score = useMemo(() => {
    return answers.reduce((acc, ans, i) => acc + (ans===QUESTIONS[i].a ? 1 : 0), 0)
  }, [answers])

  function select(i, j){
    if(submitted) return
    setAnswers(a => a.map((x, idx) => idx===i ? j : x))
  }

  return (
    <div className="quiz">
      <h3>Quick Quiz 📝</h3>
      {QUESTIONS.map((it, i) => (
        <div key={i} style={{marginBottom:10}}>
          <div style={{fontWeight:800}}>{i+1}. {it.q}</div>
          {it.opts.map((op, j) => (
            <label key={j} className="option">
              <input type="radio" name={`q${i}`} checked={answers[i]===j} onChange={()=>select(i,j)} />
              {op}
            </label>
          ))}
          {submitted && (
            <div style={{fontSize:14}}>
              {answers[i]===it.a ? '✅ Correct!' : `❌ Oops! Correct answer: ${it.opts[it.a]}`}
            </div>
          )}
        </div>
      ))}
      {!submitted ? (
        <button className="btn" onClick={()=>setSubmitted(true)}>Submit</button>
      ) : (
        <div className="score">You scored {score} / {QUESTIONS.length} 🎉</div>
      )}
    </div>
  )
}
