"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { Upload, AlertCircle, X, Image as ImageIcon, CheckCircle, ArrowLeft, ArrowRight, Users, User } from "lucide-react";

interface ImageFile {
  file: File;
  previewUrl: string;
  status: 'pending' | 'uploading' | 'success' | 'error' | 'rejected';
  error?: string;
}

interface FaceGroup {
  id: string;
  label: string;
  details: string;
  imageUrls: string[];
}

interface UploadResponse {
  success: boolean;
  message: string;
  faceGroups: FaceGroup[];
  rejectedImages: {
    filename: string;
    reason: string;
  }[];
}

export default function UploadPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState<'upload' | 'review'>('upload');
  const [faceGroups, setFaceGroups] = useState<FaceGroup[]>([]);
  const [rejectedImages, setRejectedImages] = useState<{filename: string, reason: string}[]>([]);
  const [uploadResponse, setUploadResponse] = useState<UploadResponse | null>(null);

  if (loading || !isAuthenticated) {
    router.push("/login");
    return null;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Convert FileList to array and filter valid images
    const newImages: ImageFile[] = Array.from(files).map(file => {
      // Check file type
      if (!file.type.startsWith("image/")) {
        return {
          file,
          previewUrl: URL.createObjectURL(file),
          status: 'error',
          error: "Not an image file"
        };
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        return {
          file,
          previewUrl: URL.createObjectURL(file),
          status: 'error',
          error: "Image size should be less than 5MB"
        };
      }

      return {
        file,
        previewUrl: URL.createObjectURL(file),
        status: 'pending'
      };
    });

    setImages(prev => [...prev, ...newImages]);
    setError("");
    setSuccess(false);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0 && fileInputRef.current) {
      fileInputRef.current.files = files;
      handleFileChange({ target: { files } } as any);
    }
  };

  const removeImage = (file: File) => {
    setImages(prev => prev.filter(img => img.file !== file));
  };

  const uploadImages = async () => {
    if (images.length === 0) {
      setError("Please select at least one image to upload");
      return;
    }

    setIsUploading(true);
    setError("");
    setSuccess(false);

    try {
      // Create FormData with all images
      const formData = new FormData();
      images.forEach((image, index) => {
        formData.append(`images`, image.file);
      });

      // For testing purposes, use the mock API
      // In production, use the real API: "/api/images/upload-batch"
      const response = await fetch("/api/mock/upload-batch", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload images");
      }

      const data: UploadResponse = await response.json();
      setUploadResponse(data);
      
      // Process the response
      if (data.success) {
        setFaceGroups(data.faceGroups || []);
        setRejectedImages(data.rejectedImages || []);
        setSuccess(true);
        setCurrentStep('review');
      } else {
        throw new Error(data.message || "Upload failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload images");
    } finally {
      setIsUploading(false);
    }
  };

  const updateGroupDetails = (groupId: string, field: 'label' | 'details', value: string) => {
    setFaceGroups(prev => 
      prev.map(group => 
        group.id === groupId ? { ...group, [field]: value } : group
      )
    );
  };

  const goBackToUpload = () => {
    setCurrentStep('upload');
  };

  const handleSaveAndContinue = async () => {
    try {
      // In a real implementation, you would send the updated group details to the backend
      // For now, we'll just simulate a successful save
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Redirect to dashboard or show success message
      router.push('/dashboard');
    } catch (err) {
      setError("Failed to save changes. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Upload Images</h1>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}
      
      {success && currentStep === 'upload' && (
        <div className="bg-green-50 text-green-600 p-3 rounded-md mb-4 text-sm flex items-center">
          <CheckCircle className="w-5 h-5 mr-2" />
          Images uploaded successfully!
        </div>
      )}
      
      {currentStep === 'upload' ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-6"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              multiple
              className="hidden"
            />
            
            <div className="py-8">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                Drag and drop images here, or click to select
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Select Images
              </button>
              <p className="text-xs text-gray-500 mt-2">
                Supported formats: JPG, PNG, GIF (max 5MB per image)
              </p>
            </div>
          </div>
          
          {images.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-3">Selected Images ({images.length})</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images.map((image) => (
                  <div key={image.previewUrl} className="relative group">
                    <img
                      src={image.previewUrl}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(image.file)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {image.status === 'error' && (
                      <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-white text-xs p-1 rounded-b">
                        {image.error}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={uploadImages}
              disabled={isUploading || images.length === 0}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Images
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-6">
            <button
              type="button"
              onClick={goBackToUpload}
              className="text-gray-600 hover:text-gray-900 flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Upload
            </button>
          </div>
          
          <h2 className="text-lg font-medium mb-4">Review Uploaded Images</h2>
          <p className="text-gray-600 mb-6">
            Images have been grouped based on detected faces. You can add labels and details to each group.
          </p>
          
          {faceGroups.length > 0 && (
            <div className="mb-8">
              <h3 className="text-md font-medium mb-3">Face Groups</h3>
              <div className="space-y-6">
                {faceGroups.map((group) => (
                  <div key={group.id} className="border rounded-lg p-4">
                    <div className="flex items-start mb-4">
                      <div className="flex-1">
                        <div className="mb-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Group Label
                          </label>
                          <input
                            type="text"
                            value={group.label}
                            onChange={(e) => updateGroupDetails(group.id, 'label', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Family Photos, Friends"
                          />
                        </div>
                        
                        <div className="mb-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Group Details
                          </label>
                          <textarea
                            value={group.details}
                            onChange={(e) => updateGroupDetails(group.id, 'details', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={2}
                            placeholder="e.g., Photos from family vacation, Summer 2023"
                          ></textarea>
                        </div>
                      </div>
                      
                      <div className="ml-4 flex items-center">
                        <Users className="w-5 h-5 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-500">{group.imageUrls.length} images</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {group.imageUrls.map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={url}
                            alt={`Group ${group.id} image ${index + 1}`}
                            className="w-full h-24 object-cover rounded"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {rejectedImages.length > 0 && (
            <div className="mb-8 bg-yellow-50 p-4 rounded-md">
              <h3 className="text-yellow-700 font-medium mb-2">
                {rejectedImages.length} image{rejectedImages.length !== 1 ? 's' : ''} rejected
              </h3>
              <ul className="text-sm text-yellow-600">
                {rejectedImages.map((img, index) => (
                  <li key={index} className="mb-1">
                    {img.filename}: {img.reason}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={handleSaveAndContinue}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
            >
              Save and Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 