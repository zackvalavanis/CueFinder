import type { MatchesModalProps } from '../../types/types'
import './MatchesModal.css'



export function MatchesModal({ show, onClose, matches }: MatchesModalProps) {
  if (!show || !matches) return null

  console.log(matches)

  return (
    <div>
      <div className='matches-modal-overlay'>
        <div className='matches-modal'>
          <button className='matches-modal-close' onClick={onClose}>✕</button>
          <h2>Session — {new Date(matches[0].played_at).toLocaleDateString()}</h2>
          {matches.map((match, index) => (
            <div key={match.id} className='modal-game-row'>
              <span>Game {index + 1}</span>
              <span>{match.player1.first_name} vs {match.player2.first_name}</span>
              <span>{match.player1.id === match.winner_id ? match.player1.first_name : match.player2.first_name} won</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}