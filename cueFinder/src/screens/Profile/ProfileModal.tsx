import type { ProfileModal } from "../../types/types"
import './ProfileModal.css'



export function ProfileModal({ show, onClose, uploadPhoto, changeFile, loading, preview, savedPhotoUrl }: ProfileModal) {
  if (!show) {
    return null
  }


  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <p>Update profile photo</p>
          <button onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <img className="modal-avatar" src={preview || savedPhotoUrl || undefined} />
          <label className="modal-dropzone" style={{ width: '100%' }}>
            <span className="label">Choose a photo</span>
            <span className="hint">PNG, JPG or WEBP</span>
            <input type="file" accept="image/png,image/jpeg,image/webp" onChange={changeFile} style={{ display: 'none' }} />
          </label>
          <div className="modal-actions">
            <button className="btn-cancel" onClick={onClose}>Cancel</button>
            <button className="btn-save" onClick={uploadPhoto} disabled={loading}>
              {loading ? 'Saving...' : 'Save photo'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}