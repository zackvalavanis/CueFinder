import { useState } from "react"
import { useAuth } from "../Components/useAuth"



export function Profile() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const { token } = useAuth()

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
        alert("Upload Completed")
        console.log("New photo path: ", data.profile_photo_url)
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



  return (
    <div className='profile-page'>
      <div className='profile-photo'>
        <form onSubmit={handleUpload} className="p-4 border rounded-md max-w-sm">
          <label className="block mb-2 font-medium">Upload Profile Picture:</label>
          <input
            type="file"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleFileChange} // Passed as a property, not as a child
          />
          <button
            type="submit"
            disabled={uploading || !file}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
          >
            {uploading ? "Uploading..." : "Save Image"}
          </button>
        </form>
      </div>
      <div>


      </div>



    </div>
  )
}