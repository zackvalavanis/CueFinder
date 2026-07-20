import type { MatchesModalProps } from '../../types/types'
import './MatchesModal.css'



export function MatchesModal({ show, onClose, matches }: MatchesModalProps) {
  if (!show || !matches) return null

  return (
    <div className='matches-modal-overlay'>
      <div className='matches-modal'>
        <button className='matches-modal-close' onClick={onClose}>✕</button>
        <h2>Session — {new Date(matches[0].played_at).toLocaleDateString()}</h2>
        <div className='matches-modal-games'>
          {matches.map((match, index) => (
            <div key={match.id} className='modal-game-row'>
              <span>Game {index + 1}</span>
              <span>{match.player1.first_name} vs {match.player2.first_name}</span>
              <span style={{ color: match.player1.id === match.winner_id ? '#4ade80' : '#f87171' }}>
                {match.player1.id === match.winner_id ? match.player1.first_name : match.player2.first_name} won
              </span>
              {match.p_table && (
                <span>📍 {match.p_table.name ?? match.p_table.location}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}