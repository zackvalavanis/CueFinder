import { useLocation, useNavigate } from 'react-router'
import './Results.css'
import type { PoolTable, PTablesResponse } from '../../types/types'
import { useAuth } from '../Components/useAuth'
import { useEffect, useState } from 'react'


export function Results() {
  const { token } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const results: PoolTable[] = location.state?.results ?? []
  console.log(results)
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set<string>())


  useEffect(() => {
    if (!token) return
    fetch('http://localhost:8000/p_tables', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then((data: PTablesResponse[]) => {
        if (Array.isArray(data)) {
          setLikedIds(new Set(data.map(t => t.place_id).filter(Boolean) as string[]))
        }
      })
  }, [token])


  const LikeTable = async (table: PoolTable) => {
    try {
      const res = await fetch('http://localhost:8000/p_tables', {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          place_id: table.place_id,
          rating: table.rating,
          location: table.address
        })
      })
      if (!res.ok) throw new Error("Failed to save the new table")

      setLikedIds((prev: Set<string>) => new Set(prev).add(table.place_id))
    } catch (error) {
      console.error(error)
    }

  }

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
              <button
                onClick={() => LikeTable(table)}
                disabled={likedIds.has(table.place_id)}
              >{likedIds.has(table.place_id) ? 'Saved' : 'Like'}</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}