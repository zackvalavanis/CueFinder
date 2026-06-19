import { useState } from "react"
import { useAuth } from "../Components/useAuth"
import { useEffect } from "react"
import './Profile.css'
import { ProfileModal } from "./ProfileModal"
import type { MatchesResponse, PTablesResponse } from '../../types/types'
import { MatchesModal } from "./MatchesModal"



export function Profile() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const { token, user } = useAuth()
  const [savedPhotoUrl, setSavedPhotoUrl] = useState<string | null>(null)
  const [isModalShowing, setIsModalShowing] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({ first_name: '', last_name: '', email: '' })
  const [poolTables, setPoolTables] = useState<PTablesResponse[]>([])
  const [matches, setMatches] = useState<MatchesResponse[]>([])
  const wins = matches.filter(match => match.winner_id === user?.id).length
  const losses = matches.length - wins
  const [isMatchesModalShowing, setIsMatchesModalShowing] = useState(false)
  const [selectedGame, setSelectedGame] = useState<MatchesResponse[] | null>(null)


  const groupedMatches = matches.reduce((acc, match) => {
    const key = match.session_id ?? match.id
    if (!acc[key]) acc[key] = []
    acc[key].push(match)
    return acc
  }, {} as Record<string, MatchesResponse[]>)


  useEffect(() => {
    if (!token) return
    fetch('http://localhost:8000/matches/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then((data: MatchesResponse[]) => {
        setMatches(data)
      })
  }, [token])


  useEffect(() => {
    if (!token) return
    fetch('http://localhost:8000/p_tables', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then((data: PTablesResponse[]) => {
        setPoolTables(data)
      })
  }, [token])

  useEffect(() => {
    if (!token) return
    fetch("http://localhost:8000/users/me", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.profile_photo) setSavedPhotoUrl(`http://localhost:8000${data.profile_photo}`)
        setFormData({ first_name: data.first_name, last_name: data.last_name, email: data.email })
      })
  }, [token])

  useEffect(() => {
    if (!file) return
    const url = URL.createObjectURL(file)
    setTimeout(() => setPreview(url), 0)
    return () => URL.revokeObjectURL(url)
  }, [file])


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert('Please select a file first')

    const auth_token = token

    if (!token) alert("You are not authenticated")

    const formData = new FormData()
    formData.append('file', file)

    try {
      setUploading(true)

      const res = await fetch("http://localhost:8000/users/me/profile-photo", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${auth_token}`
        },
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setSavedPhotoUrl(`http://localhost:8000${data.profile_photo_url}?t=${Date.now()}`)
        setFile(null)
        setPreview(null)
        alert("Upload Completed")
      } else {
        const errData = await res.json();
        alert(`Upload Failed : ${errData.detail || 'unknown error'}`)
      }
    } catch (error) {
      console.error("Network error during the file upload", error)
    } finally {
      setUploading(false)
    }
  }

  const handleModalShow = () => {
    setIsModalShowing(true)
  }

  const handleUpdateProfile = async () => {
    const res = await fetch("http://localhost:8000/users/me", {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })
    if (res.ok) {
      alert("Profile updated!")
    }
  }

  const handleMatchesModalClose = () => {
    setIsMatchesModalShowing(false)
  }

  const handleMatchesModalOpen = (sessionMatches: MatchesResponse[]) => {
    setSelectedGame(sessionMatches)
    setIsMatchesModalShowing(true)
  }

  return (
    <div className='profile-page'>

      {/* Sidebar */}
      <div className="profile-sidebar">
        <div className="profile-photo" onClick={handleModalShow}>
          <img src={savedPhotoUrl || undefined} alt="Profile" />
          <div className="profile-photo-overlay">
            <span>Edit</span>
          </div>
        </div>
        <p className="profile-name">{formData.first_name} {formData.last_name}</p>
        <p className="profile-role">Member since 2024</p>
      </div>

      {/* Main */}
      <div className="profile-main">
        <div className="profile-card">
          <h2>Personal info</h2>
          <div className="profile-row">
            <div className="profile-field">
              <label>First name</label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
              />
            </div>
            <div className="profile-field">
              <label>Last name</label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
              />
            </div>
          </div>
          <div className="profile-field" style={{ marginTop: '12px' }}>
            <label>Email</label>
            <input
              type="text"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
          <button onClick={handleUpdateProfile} className="profile-save">Save changes</button>
        </div>

        <div className="profile-card">
          <h2>Favorite locations</h2>
          {poolTables.length === 0 ? (
            <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>No saved locations yet.</p>
          ) : (
            poolTables.map((poolTable) => (
              <div key={String(poolTable.id)}>
                <h2>{poolTable.location}</h2>
                {poolTable.rating && <span>⭐ {poolTable.rating}</span>}
              </div>
            ))
          )}
        </div>

        <div className='profile-card'>
          {/* Add Matches below and to the backend*/}
          <h2>Matches</h2>
          <p style={{ fontSize: '13px', color: '#888', margin: 0, marginBottom: '20px' }}>Record: {wins} - {losses}</p>
          {matches.length === 0 ? (
            <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>No Matches Yet</p>
          ) : (
            Object.entries(groupedMatches).map(([sessionId, sessionMatches]) => (
              <div key={sessionId} className='ind-matches' onClick={() => handleMatchesModalOpen(sessionMatches)}>
                <h2>{new Date(sessionMatches[0].played_at).toLocaleDateString()}</h2>
                <p>{sessionMatches.length} game{sessionMatches.length > 1 ? 's' : ''}</p>
              </div>
            ))
          )}
          {/* Add record Below */}
        </div>
        <div className='profile-card'>
          <h2>Head to Head</h2>
        </div>
      </div>

      <ProfileModal
        show={isModalShowing}
        onClose={() => setIsModalShowing(false)}
        uploadPhoto={handleUpload}
        changeFile={handleFileChange}
        loading={uploading}
        preview={preview}
        savedPhotoUrl={savedPhotoUrl}
      />
      <MatchesModal
        show={isMatchesModalShowing}
        onClose={handleMatchesModalClose}
        matches={selectedGame}
      >
      </MatchesModal>
    </div >
  )
}