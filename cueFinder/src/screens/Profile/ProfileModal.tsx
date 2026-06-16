import type { ProfileModal } from "../../types/types"



export function ProfileModal({ show, onClose, uploadPhoto, changeFile, loading }: ProfileModal) {
  if (!show) {
    return null
  }


  return (
    <div>
      <form onSubmit={uploadPhoto} className="p-4 border rounded-md max-w-sm">
        <label className="block mb-2 font-medium">Upload Profile Picture:</label>
        <input
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={changeFile} // Passed as a property, not as a child
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
        >
          {loading ? "Uploading..." : "Save Image"}
        </button>
        <button onClick={onClose}>Close</button>
      </form>

    </div>
  )
}