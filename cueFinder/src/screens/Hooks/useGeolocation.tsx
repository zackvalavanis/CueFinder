import { useState } from "react";

type Coords = { lat: number; lng: number }

export function useGeolocation() {
  const [coords, setCoords] = useState<Coords | null>(null)
  const [locating, setLocating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getLocation = () => {
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lng: longitude });
        setLocating(false);
      }, (err) => {
        setLocating(false)
        if (err.code === err.PERMISSION_DENIED) {
          setError("Location access denied — search by address instead.")
        } else if (err.code === err.TIMEOUT) {
          setError("Location request timed out. Try again.")
        } else {
          setError("Couldn't determine your location.")
        }
      }
    )
  }
  return { coords, locating, error, getLocation }
}