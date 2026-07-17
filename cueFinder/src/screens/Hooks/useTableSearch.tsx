import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router"
import { useGeolocation } from "./useGeolocation"

type Prediction = { description: string, place_id: string }

export function useTableSearch(api: string) {
  const navigate = useNavigate()
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { coords, error: geoError, getLocation } = useGeolocation()

  useEffect(() => {
    return () => {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const refreshLocation = async () => {
      try {
        await getLocation()
      } catch (e) {
        console.warn("Initial background location fetch failed:", e)
      }
    }
    refreshLocation()
  }, [getLocation])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!address.trim() || address.length < 3) return

    debounceRef.current = setTimeout(async () => {
      const res = await fetch(`${api}/api/search/autocomplete?input=${encodeURIComponent(address)}`)
      const data = await res.json()
      setPredictions(data.predictions)
    }, 300)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
        debounceRef.current = null
      }
    }
  }, [address, api])

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
      const geoRes = await fetch(`${api}/api/search/geocode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address })
      })
      if (!geoRes.ok) throw new Error('Could not find that address')
      const { lat, lng } = await geoRes.json()

      const nearbyRes = await fetch(`${api}/api/search/nearby`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lng, name: predictions.length === 0 ? address : null })
      })
      if (!nearbyRes.ok) throw new Error('Could not fetch nearby tables')
      const { results } = await nearbyRes.json()

      navigate('/results', { state: { results } })
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred."
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleSearchNearby = async () => {
    if (loading) return
    setLoading(true)
    setError("")

    try {
      if (!coords?.lat || !coords.lng) {
        await getLocation()
      }

      const lat = coords?.lat
      const lng = coords?.lng

      if (!lat || !lng) {
        throw new Error(geoError || "Couldnt determine coordinates, enter manually")
      }
      const nearbyRes = await fetch(`${api}/api/search/nearby`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lat,
          lng,
          name: predictions.length === 0 ? address : null
        })
      })

      if (!nearbyRes.ok) throw new Error('Could not fetch nearby tables')

      const { results } = await nearbyRes.json()

      navigate('/results', { state: { results } })
    } catch (err) {
      console.error(err)
      const message = err instanceof Error ? err.message : String(err) || "An unexpected error occurred."
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return {
    address,
    setAddress,
    loading,
    error,
    predictions,
    setPredictions,
    handleSelect,
    handleSearch,
    handleSearchNearby,
  }
}
