import React, { useState, useEffect } from "react";
import { UserIcon, CameraIcon, SaveIcon, XIcon, LoaderIcon } from "lucide-react";
import { useAccountStore } from "../store/useAccountStore";

function AccountGeneralSection() {
  const { 
    userData, 
    updateField, 
    updateProfilePicture, 
    saveChanges, 
    resetChanges,
    isSaving,
    hasChanges,
    errors,
    setErrors 
  } = useAccountStore();
  
  const [previewImage, setPreviewImage] = useState("");
  const [localData, setLocalData] = useState({
    nickname: "",
    tag: "",
  });

  useEffect(() => {
    if (userData) {
      setLocalData({
        nickname: userData.nickname || "",
        tag: userData.tag || "",
      });
      setPreviewImage(userData.profilePic || "");
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "tag") {
      // Auto-format tag: lowercase and remove spaces
      const formattedValue = value.toLowerCase().replace(/\s/g, "");
      setLocalData(prev => ({ ...prev, [name]: formattedValue }));
      updateField(name, formattedValue);
    } else {
      setLocalData(prev => ({ ...prev, [name]: value }));
      updateField(name, value);
    }
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (errors.profilePic) {
        setErrors({ ...errors, profilePic: "" });
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        updateProfilePicture(base64String);
        setPreviewImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    updateProfilePicture("");
    setPreviewImage("");
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!localData.nickname.trim()) {
      newErrors.nickname = "Nickname is required";
    } else if (localData.nickname.length < 3) {
      newErrors.nickname = "Nickname must be at least 3 characters";
    }
    
    if (!localData.tag.trim()) {
      newErrors.tag = "Tag is required";
    } else if (localData.tag.length > 12) {
      newErrors.tag = "Tag must be 12 characters or less";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm() || !hasChanges) return;
    
    await saveChanges("general");
  };

  const handleCancel = () => {
    resetChanges();
    if (userData) {
      setLocalData({
        nickname: userData.nickname || "",
        tag: userData.tag || "",
      });
      setPreviewImage(userData.profilePic || "");
    }
  };

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <LoaderIcon className="w-8 h-8 animate-spin text-cyan-400 mx-auto mb-4" />
          <p className="text-slate-400">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-slate-200 mb-2">General Settings</h3>
        <p className="text-slate-400">Update your basic profile information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-slate-800/40 rounded-xl p-6 border border-slate-700/40">
          <h4 className="text-lg font-medium text-slate-200 mb-4 flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-cyan-400" />
            Profile Picture
          </h4>
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <div className="size-32 rounded-full overflow-hidden bg-slate-700/50 border-2 border-slate-600/50">
                {previewImage ? (
                  <img 
                    src={previewImage} 
                    alt="Profile preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <UserIcon className="size-12" />
                  </div>
                )}
              </div>
              {previewImage && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-1 -right-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 p-1.5 rounded-full border border-red-500/30"
                >
                  <XIcon className="size-4" />
                </button>
              )}
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Upload new image
                </label>
                <div className="relative">
                  <input
                    type="file"
                    id="profilePic"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="profilePic"
                    className="inline-flex items-center gap-2 bg-slate-700/50 hover:bg-slate-700/70 text-slate-300 px-4 py-2.5 rounded-lg cursor-pointer transition-colors border border-slate-600/50"
                  >
                    <CameraIcon className="size-5" />
                    Choose File
                  </label>
                  <p className="text-sm text-slate-400 mt-2">
                    JPG, PNG or WebP. Max 5MB.
                  </p>
                </div>
                {errors.profilePic && (
                  <p className="text-sm text-red-400 mt-1">{errors.profilePic}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/40 rounded-xl p-6 border border-slate-700/40 space-y-6">
          <h4 className="text-lg font-medium text-slate-200 mb-4">Profile Information</h4>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="nickname" className="auth-input-label mb-2 block">
                Nickname
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="nickname"
                  name="nickname"
                  value={localData.nickname}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="Enter your display name"
                />
              </div>
              {errors.nickname && (
                <p className="text-sm text-red-400 mt-1">{errors.nickname}</p>
              )}
              <p className="text-sm text-slate-400 mt-2">
                This is how others will see you
              </p>
            </div>

            <div>
              <label htmlFor="tag" className="auth-input-label mb-2 block">
                Unique Tag
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="tag"
                  name="tag"
                  value={localData.tag}
                  onChange={handleInputChange}
                  className="input font-mono"
                  placeholder="e.g., john.doe_123"
                  maxLength={12}
                />
              </div>
              {errors.tag && (
                <p className="text-sm text-red-400 mt-1">{errors.tag}</p>
              )}
              <p className="text-sm text-slate-400 mt-2">
                1-12 characters, lowercase only, no spaces
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-slate-700/40">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSaving || !hasChanges}
            className="px-6 py-2.5 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving || !hasChanges}
            className="px-6 py-2.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? (
              <>
                <LoaderIcon className="size-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <SaveIcon className="size-5" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AccountGeneralSection;