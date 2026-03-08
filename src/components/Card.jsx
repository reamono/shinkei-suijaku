import { memo } from 'react'

const Card = memo(function Card({ card, isFlipped, isMatched, onTap }) {
  const className = [
    'card',
    isFlipped ? 'flipped' : '',
    isMatched ? 'matched' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={className} onClick={() => onTap(card)}>
      <div className="card-inner">
        <div className="card-face card-front" />
        <div className="card-face card-back">
          <span className="card-emoji">{card.emoji}</span>
        </div>
      </div>
    </div>
  )
})

export default Card
