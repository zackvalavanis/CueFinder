import { useState } from "react"
import { useAuth } from "../Components/useAuth"
import { useEffect } from "react"
import './Profile.css'
import { ProfileModal } from "./ProfileModal"



export function Profile() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const { token } = useAuth()
  const [savedPhotoUrl, setSavedPhotoUrl] = useState<string | null>(null)
  const [isModalShowing, setIsModalShowing] = useState(false)

  useEffect(() => {
    if (!token) return
    fetch("http://localhost:8000/users/me", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.profile_photo) setSavedPhotoUrl(`http://localhost:8000${data.profile_photo}`)
      })
  }, [token])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert('Please select a file first')

    const auth_token = token
    console.log(auth_token)

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
        console.log("upload response: ", data)
        setSavedPhotoUrl(`http://localhost:8000${data.profile_photo_url}?t=${Date.now()}`)
        setFile(null)
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

  return (
    <div className='profile-page'>
      <div className='profile-photo'>
        <img src={savedPhotoUrl || undefined} onClick={handleModalShow}></img>
        <ProfileModal
          show={isModalShowing}
          onClose={() => setIsModalShowing(false)}
          uploadPhoto={handleUpload}
          changeFile={handleFileChange}
          loading={uploading}


        >

        </ProfileModal>




      </div>
      <div>


      </div>



    </div>
  )
}