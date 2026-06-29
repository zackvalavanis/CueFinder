import { useNavigate } from 'react-router'
import { useState, useEffect, useRef } from 'react'
import './Main.css'
import { useAuth } from '../Components/useAuth'
import type { Leaderboard } from '../../types/types'

export function Main() {
  const navigate = useNavigate()
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [predictions, setPredictions] = useState<{ description: string, place_id: string }[]>([])
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { user } = useAuth()
  const [leaderboard, setLeaderboard] = useState<Leaderboard[]>([])
  // const [searchName, setSearchName] = useState<string | null>('')

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
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!address.trim() || address.length < 3) return

    debounceRef.current = setTimeout(async () => {
      const res = await fetch(`http://localhost:8000/api/search/autocomplete?input=${encodeURIComponent(address)}`)
      const data = await res.json()
      setPredictions(data.predictions)
    }, 300)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
        debounceRef.current = null
      }
    }
  }, [address])

  useEffect(() => {
    fetch('http://localhost:8000/leaderboard')
      .then(res => res.json())
      .then(data => setLeaderboard(data))
      .catch(err => console.error(err))
  }, [])

  console.log(leaderboard)

  const handleSelect = (description: string) => {
    setAddress(description)
    setPredictions([])
  }

  const handleSearch = async () => {
    if (!address.trim()) return
    setLoading(true)
    setError('')
    setPredictions([])

    try {
      const geoRes = await fetch('http://localhost:8000/api/search/geocode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address })
      })
      if (!geoRes.ok) throw new Error('Could not find that address')
      const { lat, lng } = await geoRes.json()

      const nearbyRes = await fetch('http://localhost:8000/api/search/nearby', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lng, name: predictions.length === 0 ? address : null })
      })
      if (!nearbyRes.ok) throw new Error('Could not fetch nearby tables')
      const { results } = await nearbyRes.json()

      navigate('/results', { state: { results } })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }


  const HandleFlipLeaderboards = async () => {
    console.log('flipping')
    try {
      const res = await fetch('http://localhost:8000/matches', {
        method: 'GET'
      })

      const data = await res.json()
      console.log(data)
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
