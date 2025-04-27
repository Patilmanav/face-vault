"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { Search, Upload, AlertCircle, X, Image as ImageIcon, SlidersHorizontal } from "lucide-react";

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
  const imageRef = useRef<HTMLImageElement>(null);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");
  const [searchThreshold, setSearchThreshold] = useState(0.6);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

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

    setIsSearching(true);
    setError("");
    setSearchResults([]);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("threshold", searchThreshold.toString());

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
      console.log(data);
      setSearchResults(data.results);
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
      const syntheticEvent = {
        target: { files: e.dataTransfer.files } as HTMLInputElement,
        currentTarget: { files: e.dataTransfer.files } as HTMLInputElement,
        preventDefault: () => {},
        stopPropagation: () => {},
      } as React.ChangeEvent<HTMLInputElement>;
      handleFileChange(syntheticEvent);
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
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600 mb-2">Image Search</h1>
          <p className="text-lg text-gray-400">Upload an image to find similar matches in your collection</p>
        </div>
        
        {error && (
          <div className="max-w-3xl mx-auto mb-8">
            <div className="bg-red-900/50 border-l-4 border-red-400 p-4 rounded-md">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
                <p className="text-sm text-red-200">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <div className="bg-gray-800/50 rounded-xl shadow-sm border border-gray-700/50 overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-200 mb-4">Upload Image</h2>
                
                <div
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors duration-200 ${
                    previewUrl ? 'border-gray-700' : 'border-gray-600 hover:border-blue-400'
                  }`}
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
                    <div className="relative group">
                      <img
                        ref={imageRef}
                        src={previewUrl}
                        alt="Preview"
                        className="max-h-64 mx-auto rounded-lg shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewUrl(null);
                          setSearchResults([]);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                        className="absolute top-2 right-2 bg-gray-800 text-gray-300 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="py-8">
                      <div className="bg-gray-700 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <Upload className="w-8 h-8 text-blue-400" />
                      </div>
                      <p className="text-gray-400 mb-4">
                        Drag and drop an image here, or click to select
                      </p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                      >
                        Select Image
                      </button>
                      <p className="text-xs text-gray-500 mt-4">
                        Supported formats: JPG, PNG, GIF (max 5MB)
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="threshold" className="text-sm font-medium text-gray-300">
                      Similarity Threshold
                    </label>
                    <span className="text-sm font-medium text-blue-400">
                      {formatSimilarity(searchThreshold)}
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      id="threshold"
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.05"
                      value={searchThreshold}
                      onChange={(e) => setSearchThreshold(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Less Strict</span>
                      <span>More Strict</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleSearch}
                  disabled={isSearching || !selectedFile}
                  className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors duration-200"
                >
                  {isSearching ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      Search
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-8">
            <div className="bg-gray-800/50 rounded-xl shadow-sm border border-gray-700/50 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-200">Search Results</h2>
                  {searchResults.length > 0 && (
                    <span className="text-sm text-gray-400">
                      Found {searchResults.length} matches
                    </span>
                  )}
                </div>
                
                {searchResults.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {searchResults.map((result) => (
                      <div key={result.id} className="group relative bg-gray-800/30 rounded-lg border border-gray-700/50 overflow-hidden hover:shadow-md transition-shadow duration-200">
                        <div className="aspect-square relative bg-gray-700">
                          <img
                            src={result.url}
                            alt={result.label || "Search result"}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                            {formatSimilarity(result.similarity)}
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium text-gray-200 truncate">
                            {result.label || "Untitled"}
                          </h3>
                          {result.details && (
                            <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                              {result.details}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-2">
                            Added on {formatDate(result.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="bg-gray-700 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-400">
                      {isSearching
                        ? "Searching for matches..."
                        : "Upload an image to search for matches"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 