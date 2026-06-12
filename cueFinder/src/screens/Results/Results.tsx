import { useLocation, useNavigate } from 'react-router'
import './Results.css'

interface PoolTable {
  name: string
  address: string
  place_id: string
  rating: number | null
  maps_url: string
}

export function Results() {
  const location = useLocation()
  const navigate = useNavigate()
  const results: PoolTable[] = location.state?.results ?? []
  console.log('location.state:', location.state)

  return (
    <div className="results-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <h1>Pool Tables Near You</h1>
      <p className="results-count">{results.length} locations found</p>

      {results.length === 0 ? (
        <p className="no-results">No pool tables found near that address.</p>
      ) : (
        <div className="results-list">
          {results.map((table) => (
            <div key={table.place_id} className="result-card">
              <div className="result-info">
                <h2>{table.name}</h2>
                <p>{table.address}</p>
                {table.rating && (
                  <span className="rating">⭐ {table.rating}</span>
                )}
              </div>

              href={table.maps_url}
              target="_blank"
              rel="noreferrer"
              className="maps-btn"
              <a>
                Get Directions
              </a>
            </div>
          ))}
        </div>
      )
      }
    </div >
  )
}