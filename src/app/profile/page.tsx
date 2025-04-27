"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { User, Mail, Lock, AlertCircle, Save, Loader2, Camera, HardDrive, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
  storage_used: number;
  max_storage: number;
  image_count: number;
  max_images: number;
  created_at: string;
  updated_at: string;
}

export default function ProfilePage() {
  const { isAuthenticated, loading, user, logout } = useAuth();
  const router = useRouter();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isAuthenticated) {
      fetchUserProfile();
    }
  }, [isAuthenticated, loading, router]);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      const response = await fetch("/api/auth/status", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch profile");
      }

      const data = await response.json();
      setProfile(data.user);
      setFormData(prev => ({
        ...prev,
        name: data.user.name || "",
        email: data.user.email || ""
      }));
      
      // If there's an avatar URL in the future, set it here
      // if (data.avatar_url) {
      //   setAvatarPreview(data.avatar_url);
      // }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Image size should be less than 2MB");
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    try {
      setIsSaving(true);
      setError("");
      setSuccess("");
      
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      
      if (formData.currentPassword) {
        formDataToSend.append("currentPassword", formData.currentPassword);
      }
      
      if (formData.newPassword) {
        formDataToSend.append("newPassword", formData.newPassword);
      }
      
      if (avatarFile) {
        formDataToSend.append("avatar", avatarFile);
      }

      const response = await fetch("/api/users/profile", {
        method: "PUT",
        body: formDataToSend,
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const data = await response.json();
      setProfile(data.profile);
      setSuccess("Profile updated successfully");
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (err) {
      setError("Failed to log out. Please try again.");
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading || !isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600 mb-2">Profile Settings</h1>
          <p className="text-lg text-gray-400">Manage your account information</p>
        </div>
        
        {error && (
          <div className="mb-8">
            <div className="bg-red-900/50 border-l-4 border-red-400 p-4 rounded-md">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
                <p className="text-sm text-red-200">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {success && (
          <div className="mb-8">
            <div className="bg-green-900/50 border-l-4 border-green-400 p-4 rounded-md">
              <div className="flex items-center">
                <Save className="w-5 h-5 text-green-400 mr-3" />
                <p className="text-sm text-green-200">{success}</p>
              </div>
            </div>
          </div>
        )}
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <span className="ml-2 text-gray-400">Loading profile...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Account Stats */}
            <div className="bg-gray-800/50 rounded-xl shadow-sm border border-gray-700/50 overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-200 mb-4">Account Overview</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <HardDrive className="w-5 h-5 text-blue-400 mr-2" />
                      <h3 className="text-sm font-medium text-gray-300">Storage Usage</h3>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-gray-200">
                        {formatBytes(profile?.storage_used || 0)}
                      </span>
                      <span className="text-sm text-gray-400">
                        of {formatBytes(profile?.max_storage || 0)}
                      </span>
                    </div>
                    <div className="mt-2 w-full bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${((profile?.storage_used || 0) / (profile?.max_storage || 1)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <ImageIcon className="w-5 h-5 text-blue-400 mr-2" />
                      <h3 className="text-sm font-medium text-gray-300">Images</h3>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-gray-200">
                        {profile?.image_count || 0}
                      </span>
                      <span className="text-sm text-gray-400">
                        of {profile?.max_images || 0}
                      </span>
                    </div>
                    <div className="mt-2 w-full bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${((profile?.image_count || 0) / (profile?.max_images || 1)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Account ID</p>
                      <p className="text-gray-200 font-mono">{profile?._id}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Role</p>
                      <p className="text-gray-200">{profile?.role}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Created</p>
                      <p className="text-gray-200">{profile?.created_at ? formatDate(profile.created_at) : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Last Updated</p>
                      <p className="text-gray-200">{profile?.updated_at ? formatDate(profile.updated_at) : 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Profile Form */}
            <div className="bg-gray-800/50 rounded-xl shadow-sm border border-gray-700/50 overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-200 mb-6">Edit Profile</h2>
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-8 flex flex-col items-center">
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                        {avatarPreview ? (
                          <Image
                            src={avatarPreview}
                            alt="Profile avatar"
                            width={128}
                            height={128}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-16 h-16 text-gray-400" />
                        )}
                      </div>
                      <label 
                        htmlFor="avatar-upload" 
                        className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors duration-200"
                      >
                        <Camera className="w-5 h-5" />
                      </label>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </div>
                    <p className="mt-4 text-sm text-gray-400">
                      Click the camera icon to change your profile picture
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                        Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Your name"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                        Email
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t border-gray-700">
                      <h3 className="text-lg font-medium text-gray-200 mb-4">Change Password</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-1">
                            Current Password
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              id="currentPassword"
                              name="currentPassword"
                              type="password"
                              value={formData.currentPassword}
                              onChange={handleInputChange}
                              className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Enter your current password"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-1">
                            New Password
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              id="newPassword"
                              name="newPassword"
                              type="password"
                              value={formData.newPassword}
                              onChange={handleInputChange}
                              className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Enter your new password"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                            Confirm New Password
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              id="confirmPassword"
                              name="confirmPassword"
                              type="password"
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Confirm your new password"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t border-gray-700 flex justify-between">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="px-4 py-2 border border-gray-700 rounded-md text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors duration-200"
                      >
                        Logout
                      </button>
                      
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 