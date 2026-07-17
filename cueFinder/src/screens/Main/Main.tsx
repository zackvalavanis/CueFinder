import { useNavigate } from 'react-router'
import { useState, useEffect } from 'react'
import './Main.css'
import { useAuth } from '../Components/useAuth'
import type { Leaderboard } from '../../types/types'
import { useTableSearch } from '../Hooks/useTableSearch'

export function Main() {
  const navigate = useNavigate()
  const api = import.meta.env.VITE_BACKEND_API
  const { user } = useAuth()
  const [leaderboard, setLeaderboard] = useState<Leaderboard[]>([])
  const {
    address, setAddress, loading, error, predictions, setPredictions,
    handleSelect, handleSearch, handleSearchNearby,
  } = useTableSearch(api)

  useEffect(() => {
    const hash = window.location.hash
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }, [])

  useEffect(() => {
    fetch(`${api}/leaderboard`)
      .then(res => res.json())
      .then(data => setLeaderboard(data))
      .catch(err => console.error(err))
  }, [api])

  const HandleFlipLeaderboards = async () => {
    try {
      await fetch(`${api}/matches`, { method: 'GET' })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="main-page">
      <section id='search-tables' className="section1">
        <h1>Find Pool Tables Near You</h1>
        <div className="search-wrapper">
          <div className="search_button">
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
            <button onClick={handleSearchNearby}>Search Nearby</button>
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

      <section id='match' className="section middle">
        <p className="middle-heading">Why CueFinder</p>
        <h2 className="middle-title">Everything you need at the table.</h2>
        <div className="middle-middle">
          <a style={{ textDecoration: 'none' }} href='#search-tables'>
            <div className="middle-boxes">
              <span className="icon">🎱</span>
              <h1>Search for pool tables nearby.</h1>
            </div>
          </a>
          <div className="middle-boxes">
            <span className="icon">⭐</span>
            <h1>Save your favorite tables to your profile.</h1>
          </div>
          <a style={{ textDecoration: 'none' }} href='#leaderboard'>
            <div className="middle-boxes">
              <span className="icon">📊</span>
              <h1>Track games and history against your competition.</h1>
            </div>
          </a>
        </div>
        <div>
          {user ? (
            <button className='match-button' onClick={() => navigate('/Match-play')}>
              <span className="pocket top-left"></span>
              <span className="pocket top-right"></span>
              <span className="pocket bottom-left"></span>
              <span className="pocket bottom-right"></span>
              Match Play</button>
          ) : (
            <div className='match-play-section-2'>
              <h1>Log in for match play</h1>
              <button onClick={() => navigate('/login')}>Log in</button>
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div id='leaderboard' className='leaderBoards'>
          <h1 onClick={HandleFlipLeaderboards}>Leaderboards</h1>
          <table>
            <thead className='headers'>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Wins</th>
                <th>Losses</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((leaders, index) => (
                <tr key={leaders.id}>
                  <td>{index + 1}</td>
                  <td className='player-name-leaderboard' onClick={user ? () => navigate('/Match-play', { state: { player_id: leaders.id } }) : undefined}>{leaders.first_name} {leaders.last_name}</td>
                  <td>{leaders.wins}</td>
                  <td>{leaders.losses}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section >
    </div >
  )
}
