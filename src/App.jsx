import { useState, useCallback } from 'react'
import Board from './components/Board'
import './App.css'

const DIFFICULTY = {
  easy: { pairs: 6, cols: 3, label: 'かんたん (6ペア)' },
  normal: { pairs: 8, cols: 4, label: 'ふつう (8ペア)' },
  hard: { pairs: 12, cols: 4, label: 'むずかしい (12ペア)' },
}

export default function App() {
  const [difficulty, setDifficulty] = useState('normal')
  const [gameKey, setGameKey] = useState(0)
  const [stats, setStats] = useState(null)

  const handleComplete = useCallback((moves, time) => {
    setStats({ moves, time })
  }, [])

  const handleRestart = () => {
    setStats(null)
    setGameKey((k) => k + 1)
  }

  const config = DIFFICULTY[difficulty]

  return (
    <div className="app">
      <header className="header">
        <h1>神経衰弱</h1>
        <div className="difficulty-selector">
          {Object.entries(DIFFICULTY).map(([key, val]) => (
            <button
              key={key}
              className={`diff-btn ${difficulty === key ? 'active' : ''}`}
              onClick={() => {
                setDifficulty(key)
                setStats(null)
                setGameKey((k) => k + 1)
              }}
            >
              {val.label}
            </button>
          ))}
        </div>
      </header>

      <Board
        key={gameKey}
        pairs={config.pairs}
        cols={config.cols}
        onComplete={handleComplete}
      />

      {stats && (
        <div className="modal-overlay" onClick={handleRestart}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>クリア！</h2>
            <div className="modal-stats">
              <div className="stat-item">
                <span className="stat-label">手数</span>
                <span className="stat-value">{stats.moves}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">タイム</span>
                <span className="stat-value">{formatTime(stats.time)}</span>
              </div>
            </div>
            <button className="restart-btn" onClick={handleRestart}>
              もう一度
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return m > 0 ? `${m}分${s}秒` : `${s}秒`
}
