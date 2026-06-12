import { useNavigate } from 'react-router'
import { useState } from 'react'
import './Main.css'

export function Main() {
  const navigate = useNavigate()
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async () => {
    if (!address.trim()) return
    setLoading(true)
    setError('')

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
        body: JSON.stringify({ lat, lng })
      })

      if (!nearbyRes.ok) throw new Error('Could not fetch nearby tables')
      const { results } = await nearbyRes.json()
      console.log('results:', results)

      navigate('/results', { state: { results } })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="main-page">
      <section className="section1">
        <h1>Find Pool Tables Near You</h1>
        <div className="search_button">
          <input
            type="text"
            placeholder="Enter your address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch} disabled={loading}>
            {loading ? '...' : 'Search'}
          </button>
        </div>
        {error && <p style={{ color: '#f87171', marginTop: '1rem', fontSize: '14px' }}>{error}</p>}
      </section>

      <section className="section middle">
        <p className="middle-heading">Why CueFinder</p>
        <h2 className="middle-title">Everything you need at the table.</h2>
        <div className="middle-middle">
          <div className="middle-boxes">
            <span className="icon">🎱</span>
            <h1>Search for pool tables nearby.</h1>
          </div>
          <div className="middle-boxes">
            <span className="icon">⭐</span>
            <h1>Save your favorite tables to your profile.</h1>
          </div>
          <div className="middle-boxes">
            <span className="icon">📊</span>
            <h1>Track games and history against your competition.</h1>
          </div>
        </div>
      </section>

      <section className="section">
        <h1>Bottom Section</h1>
      </section>
    </div>
  )
}