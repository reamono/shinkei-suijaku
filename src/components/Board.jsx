import { useState, useRef, useEffect, useCallback } from 'react'
import Card from './Card'

const ALL_EMOJIS = [
  '🐶', '🐱', '🐼', '🦊', '🐸', '🐵',
  '🦁', '🐯', '🐨', '🐰', '🐻', '🦄',
  '🐙', '🦋', '🐢', '🦀', '🐬', '🦩',
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function createCards(pairCount) {
  const emojis = shuffle(ALL_EMOJIS).slice(0, pairCount)
  return shuffle(
    emojis.flatMap((emoji, i) => [
      { id: i * 2, emoji, pairId: i },
      { id: i * 2 + 1, emoji, pairId: i },
    ])
  )
}

export default function Board({ pairs, cols, onComplete }) {
  const [cards] = useState(() => createCards(pairs))
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState(new Set())
  const [moves, setMoves] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [started, setStarted] = useState(false)
  const lockRef = useRef(false)
  const timerRef = useRef(null)

  useEffect(() => {
    if (started) {
      timerRef.current = setInterval(() => {
        setElapsed((e) => e + 1)
      }, 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [started])

  const handleTap = useCallback(
    (card) => {
      if (lockRef.current) return
      if (matched.has(card.pairId)) return
      if (flipped.includes(card.id)) return

      if (!started) setStarted(true)

      const next = [...flipped, card.id]

      if (next.length === 1) {
        setFlipped(next)
        return
      }

      // Two cards flipped
      setFlipped(next)
      setMoves((m) => m + 1)
      lockRef.current = true

      const first = cards.find((c) => c.id === next[0])
      const second = card

      if (first.pairId === second.pairId) {
        // Match found
        const newMatched = new Set([...matched, card.pairId])
        setMatched(newMatched)
        setFlipped([])
        lockRef.current = false

        if (newMatched.size === pairs) {
          clearInterval(timerRef.current)
          setTimeout(() => onComplete(moves + 1, elapsed), 500)
        }
      } else {
        // No match - flip back
        setTimeout(() => {
          setFlipped([])
          lockRef.current = false
        }, 800)
      }
    },
    [flipped, matched, cards, started, moves, elapsed, pairs, onComplete]
  )

  const formatTime = (s) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  return (
    <>
      <div className="status-bar">
        <div className="status-item">
          <span className="status-label">手数</span>
          <span className="status-value">{moves}</span>
        </div>
        <div className="status-item">
          <span className="status-label">ペア</span>
          <span className="status-value">
            {matched.size}/{pairs}
          </span>
        </div>
        <div className="status-item">
          <span className="status-label">タイム</span>
          <span className="status-value">{formatTime(elapsed)}</span>
        </div>
      </div>

      <div className="board-container">
        <div
          className="board"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              isFlipped={flipped.includes(card.id) || matched.has(card.pairId)}
              isMatched={matched.has(card.pairId)}
              onTap={handleTap}
            />
          ))}
        </div>
      </div>
    </>
  )
}
