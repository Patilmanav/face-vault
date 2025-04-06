"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { Search, Upload, AlertCircle, X, Image as ImageIcon } from "lucide-react";
import * as faceapi from "face-api.js";

interface SearchResult {
  id: string;
  url: string;
  label: string | null;
  details: string | null;
  similarity: number;
  createdAt: string;
}

export default function SearchPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");
  const [faceDetected, setFaceDetected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchThreshold, setSearchThreshold] = useState(0.6);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [modelLoadError, setModelLoadError] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    // Load face-api models
    const loadModels = async () => {
      try {
        setIsLoading(true);
        setModelLoadError(false);
        
        // Try to load the models
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
          faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        ]);
        
        setModelsLoaded(true);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading face-api models:", error);
        setModelLoadError(true);
        setError("Failed to load face detection models. You can still upload images for search.");
        setIsLoading(false);
      }
    };

    loadModels();
  }, []);

  useEffect(() => {
    if (previewUrl && canvasRef.current && imageRef.current) {
      detectFaces();
    }
  }, [previewUrl]);

  const detectFaces = async () => {
    if (!canvasRef.current || !imageRef.current) return;

    try {
      // If models failed to load, we'll assume a face is detected for testing purposes
      if (modelLoadError) {
        setFaceDetected(true);
        return;
      }

      const detections = await faceapi.detectAllFaces(
        imageRef.current,
        new faceapi.TinyFaceDetectorOptions()
      );

      setFaceDetected(detections.length > 0);

      // Draw detections on canvas
      const canvas = canvasRef.current;
      const displaySize = { width: imageRef.current.width, height: imageRef.current.height };
      faceapi.matchDimensions(canvas, displaySize);
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      faceapi.draw.drawDetections(canvas, resizedDetections);
    } catch (error) {
      console.error("Error detecting faces:", error);
      // For testing purposes, we'll assume a face is detected even if detection fails
      setFaceDetected(true);
      setError("Face detection failed. You can still proceed with the search.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError("");
    setSearchResults([]);
  };

  const handleSearch = async () => {
    if (!selectedFile) return;

    // For testing purposes, we'll allow search even if no face is detected
    if (!faceDetected && !modelLoadError) {
      setError("No face detected in the image. Please upload an image with a clear face.");
      return;
    }

    setIsSearching(true);
    setError("");
    setSearchResults([]);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("threshold", searchThreshold.toString());

      // Call your Flask API to search for similar faces
      const response = await fetch("/api/images/search", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to search for similar faces");
      }

      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search for similar faces");
    } finally {
      setIsSearching(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files?.[0];
    if (file && fileInputRef.current) {
      fileInputRef.current.files = e.dataTransfer.files;
      handleFileChange({ target: { files: [file] } } as any);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatSimilarity = (similarity: number) => {
    return `${(similarity * 100).toFixed(1)}%`;
  };

  if (loading || !isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Face Search</h1>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}
      
      {modelLoadError && (
        <div className="bg-yellow-50 text-yellow-700 p-3 rounded-md mb-4 text-sm flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          Face detection models failed to load. You can still upload images for search.
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Upload Image</h2>
            
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              
              {previewUrl ? (
                <div className="relative">
                  <img
                    ref={imageRef}
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-64 mx-auto mb-4"
                    onLoad={() => detectFaces()}
                  />
                  <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 w-full h-full"
                    style={{ pointerEvents: "none" }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                      setFaceDetected(false);
                      setSearchResults([]);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="py-8">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    Drag and drop an image here, or click to select
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Select Image
                  </button>
                  <p className="text-xs text-gray-500 mt-2">
                    Supported formats: JPG, PNG, GIF (max 5MB)
                  </p>
                </div>
              )}
            </div>
            
            {previewUrl && (
              <div className="bg-blue-50 p-4 rounded-md mb-4">
                <p className="text-sm text-blue-700">
                  {faceDetected
                    ? "Face detected! You can proceed with the search."
                    : "No face detected in the image. Please upload an image with a clear face."}
                </p>
              </div>
            )}
            
            <div className="mb-4">
              <label htmlFor="threshold" className="block text-sm font-medium text-gray-700 mb-1">
                Similarity Threshold: {formatSimilarity(searchThreshold)}
              </label>
              <input
                id="threshold"
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={searchThreshold}
                onChange={(e) => setSearchThreshold(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Less Strict</span>
                <span>More Strict</span>
              </div>
            </div>
            
            <button
              onClick={handleSearch}
              disabled={isSearching || (!faceDetected && !modelLoadError)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </>
              )}
            </button>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Search Results</h2>
            
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {searchResults.map((result) => (
                  <div key={result.id} className="border rounded-lg overflow-hidden">
                    <div className="aspect-square relative bg-gray-100">
                      <img
                        src={result.url}
                        alt={result.label || "Search result"}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                        {formatSimilarity(result.similarity)}
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium truncate">{result.label || "Untitled"}</h3>
                      {result.details && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{result.details}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        Added on {formatDate(result.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">
                  {isSearching
                    ? "Searching for similar faces..."
                    : "Upload an image with a face to search for matches"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 