import { useEffect, useState } from "react"
import type { PTablesResponse, PublicUser } from "../../types/types"
import './MatchPlay.css'
import { useAuth } from "../Components/useAuth"
import type { Game } from "../../types/types"

export function MatchPlay() {
  const [players, setPlayers] = useState<PublicUser[]>([])
  const [loading, setLoading] = useState(false)
  const { user, token } = useAuth()
  const [games, setGames] = useState<Game[]>([{ id: 1, opponent_id: null, winner: null, session_id: null }])
  const [poolTables, setPoolTables] = useState<PTablesResponse[]>([])
  const [selectedTable, setSelectedTable] = useState<string>('')


  const addGame = () => {
    setGames(prev => [...prev, { id: prev.length + 1, opponent_id: null, winner: null, session_id: null }])
  }

  const updateGame = (id: number, field: keyof Game, value: string) => {
    setGames(prev =>
      prev.map(g => g.id === id ? { ...g, [field]: value } : g)
    )
  }

  const saveSession = async () => {
    if (!user) return
    const session_id = crypto.randomUUID()

    const payload = games
      .filter(g => g.winner !== null && g.opponent_id !== null)
      .map(g => ({
        session_id,
        player1_id: user.id,
        player2_id: g.opponent_id,
        winner_id: g.winner,
        p_table_id: selectedTable || null
      }))

    if (payload.length === 0) return

    const res = await fetch('http://localhost:8000/matches/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    })

    if (res.ok) {
      setGames([{ id: 1, opponent_id: null, winner: null, session_id: null }])
    }
  }

  useEffect(() => {
    const handleUserFetch = async () => {
      setLoading(true)
      try {
        const res = await fetch('http://localhost:8000/users')
        const data = await res.json()
        setPlayers(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    handleUserFetch()
  }, [])

  useEffect(() => {
    if (!token) return
    fetch('http://localhost:8000/p_tables', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setPoolTables(data))
  }, [token])



  return (
    <div className='match-play-page'>
      <div className='players-container'>
        <h1>Set up Match</h1>


        <div className='match-grid'>
          {loading ? <p>Loading...</p> : (
            <table>
              <thead>
                <tr>
                  <th>Game</th>
                  <th>Location</th>
                  <th>Opponent</th>
                  <th>You</th>
                  <th>Them</th>
                </tr>
              </thead>
              <tbody>
                {games.map((game) => (
                  <tr key={game.id}>
                    <td>Game {game.id}</td>
                    <td>
                      <select
                        value={selectedTable}
                        onChange={(e) => setSelectedTable(e.target.value)}
                      >
                        <option value="">Select location</option>
                        {poolTables.map(t => (
                          <option key={t.id} value={t.id}>
                            {t.name ?? t.location}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        value={game.opponent_id ?? ""}
                        onChange={(e) => updateGame(game.id, 'opponent_id', e.target.value)}
                      >
                        <option value="">Select opponent</option>
                        {players.filter(p => p.id !== user?.id).map(p => (
                          <option key={p.id} value={p.id}>
                            {p.first_name} {p.last_name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button
                        className={`winner-btn ${game.winner === user?.id ? 'active' : ''}`}
                        onClick={() => { if (user?.id) updateGame(game.id, 'winner', user.id) }}
                      >
                        {user?.first_name}
                      </button>
                    </td>
                    <td>
                      <button
                        className={`winner-btn ${game.winner === game.opponent_id ? 'active' : ''}`}
                        onClick={() => updateGame(game.id, 'winner', game.opponent_id!)}
                        disabled={!game.opponent_id}
                      >
                        {players.find(p => p.id === game.opponent_id)?.first_name ?? '?'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4}>
                    <button className="add-game-btn" onClick={addGame}>+ Add Game</button>
                  </td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
        <button className="save-btn" onClick={saveSession}>Save Session</button>
      </div>
    </div>
  )
}