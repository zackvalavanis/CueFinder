import { useEffect, useState } from "react"
import type { PTablesResponse, PublicUser } from "../../types/types"
import './MatchPlay.css'
import { useAuth } from "../Components/useAuth"
import type { Game } from "../../types/types"
import { useLocation } from "react-router"
import type { PoolTable } from "../../types/types"
import { useTableSearch } from "../Hooks/useTableSearch"


export function MatchPlay() {
  const api = import.meta.env.VITE_BACKEND_API
  const [players, setPlayers] = useState<PublicUser[]>([])
  const [playersLoading, setPlayersLoading] = useState(false)
  const [savingSession, setSavingSession] = useState(false)
  const { user, token } = useAuth()
  const location = useLocation()
  const [poolTables, setPoolTables] = useState<PTablesResponse[]>([])
  const table: PoolTable = location.state?.table
  const player_id: string | null = location.state?.player_id
  const [games, setGames] = useState<Game[]>([{ id: 1, opponent_id: player_id ?? null, winner: null, session_id: null, table_id: table?.place_id ?? null }])
  const {
    address, setAddress, loading, error, predictions, setPredictions,
    handleSelect, handleSearch, handleSearchNearby,
  } = useTableSearch(api)

  const addGame = () => {
    setGames(prev => [...prev, { id: prev.length + 1, opponent_id: player_id ?? null, winner: null, session_id: null, table_id: null }])
  }

  const updateGame = (id: number, field: keyof Game, value: string) => {
    setGames(prev =>
      prev.map(g => g.id === id ? { ...g, [field]: value } : g)
    )
  }

  const saveSession = async () => {
    if (!user || savingSession) return
    const session_id = crypto.randomUUID()

    const payload = games
      .filter(g => g.winner !== null && g.opponent_id !== null)
      .map(g => ({
        session_id,
        player1_id: user.id,
        player2_id: g.opponent_id,
        winner_id: g.winner,
        p_table_id: poolTables.find(t => t.place_id === g.table_id)?.id ?? null
      }))
    if (payload.length === 0) return

    setSavingSession(true)
    try {
      const res = await fetch(`${api}/matches/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        setGames([{ id: 1, opponent_id: null, winner: null, session_id: null, table_id: table?.place_id ?? null }])
        alert("Saved Session")
      }
    } finally {
      setSavingSession(false)
    }
  }

  useEffect(() => {
    const handleUserFetch = async () => {
      setPlayersLoading(true)
      try {
        const res = await fetch(`${api}/users`)
        const data = await res.json()
        setPlayers(data)
      } catch (error) {
        console.error(error)
      } finally {
        setPlayersLoading(false)
      }
    }
    handleUserFetch()
  }, [api])

  useEffect(() => {
    if (!token) return
    fetch(`${api}/p_tables`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setPoolTables(data))
  }, [token, api])


  return (
    <div className='match-play-page'>
      <div className='players-container'>
        <h1>Set up Match</h1>
        <h3>Find a table</h3>
        <section className='containerSearch-tables'>
          <div className="search-container-wrapper">
            <div className="search_button_match">
              <input
                type="text"
                placeholder="Enter your address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                onBlur={() => setTimeout(() => setPredictions([]), 150)}
              />
              <button onClick={handleSearch} disabled={loading}>
                {loading ? '...' : 'Search'}
              </button>
              <button onClick={handleSearchNearby} disabled={loading}>
                {loading ? '...' : 'Search Nearby'}
              </button>
            </div>
            {predictions.length > 0 && (
              <ul className="autocomplete-list">
                {predictions.map((p) => (
                  <li
                    key={p.place_id}
                    onClick={() => handleSelect(p.description)}
                    className="autocomplete-item"
                  >
                    {p.description}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {error && <p className="search-error">{error}</p>}
        </section>


        <div className='match-grid'>
          {playersLoading ? <p>Loading...</p> : (
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
                    <td data-label="Game">Game {game.id}</td>
                    <td data-label="Location">
                      <select
                        value={game.table_id ?? ""}
                        onChange={(e) => updateGame(game.id, 'table_id', e.target.value)}
                      >
                        <option value="">Select location</option>
                        {table && !poolTables.some(t => t.place_id === table.place_id) && (
                          <option value={table.place_id}>{table.name}</option>
                        )}
                        {poolTables.map(t => (
                          <option key={t.id} value={t.place_id ?? String(t.id)}>
                            {t.name ?? t.location}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td data-label="Opponent">
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
                    <td data-label="You win?">
                      <button
                        className={`winner-btn ${game.winner === user?.id ? 'active' : ''}`}
                        onClick={() => { if (user?.id) updateGame(game.id, 'winner', user.id) }}
                      >
                        {user?.first_name}
                      </button>
                    </td>
                    <td data-label="They win?">
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
                  <td colSpan={5}>
                    <button className="add-game-btn" onClick={addGame}>+ Add Game</button>
                  </td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
        <button className="save-btn" onClick={saveSession} disabled={savingSession}>
          {savingSession ? 'Saving...' : 'Save Session'}
        </button>
      </div>
    </div>
  )
}
