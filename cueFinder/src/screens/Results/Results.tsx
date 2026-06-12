import { useLocation, useNavigate } from 'react-router'
import './Results.css'

interface PoolTable {
  name: string
  address: string
  place_id: string
  rating: number | null
  maps_url: string
  lat: number
  lng: number
}

export function Results() {
  const location = useLocation()
  const navigate = useNavigate()
  const results: PoolTable[] = location.state?.results ?? []
  console.log(results)

  return (
    <div className="results-page">
      <div className="results-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1>Pool Tables Near You</h1>
        <p className="results-count">{results.length} locations found</p>
      </div>

      {results.length === 0 ? (
        <p className="no-results">No pool tables found near that address.</p>
      ) : (
        <div className="results-list">
          {results.map((table, i) => (
            <div key={table.place_id} className="result-card">
              <span className="result-index">{i + 1}</span>
              <div className="result-info">
                <h2>{table.name}</h2>
                <p>{table.address}</p>
                {table.rating && (
                  <div className="result-meta">
                    <span className="rating">⭐ {table.rating}</span>
                  </div>
                )}
              </div>
              <a href={table.maps_url}>
                Get Directions
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}