"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import Link from "next/link";
import { Upload, Search, Image as ImageIcon, Trash2, Edit, AlertCircle, Users } from "lucide-react";
import Image from "next/image";

interface ImageGroup {
  id: string;
  image_urls: string[];
}

interface Image {
  id: string;
  url: string;
  label: string | null;
  details: string | null;
  createdAt: string;
}

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [recentImages, setRecentImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchRecentImages();
    }
  }, [isAuthenticated]);

  const fetchRecentImages = async () => {
    try {
      const response = await fetch("/api/images/recent", {
        credentials: "include",
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch recent images");
      }
  
      const data = await response.json();
      console.log("Fetched recent images:", data);
  
      const groups = data.images ?? []; // fallback to empty array
  
      const images = groups.flatMap((group: ImageGroup) =>
        group.image_urls.map((url: string, index: number) => ({
          id: `${group.id}-${index}`,
          url,
          label: `Image ${index + 1}`,
          createdAt: new Date().toISOString(), // replace with real timestamp if available
        }))
      );
      console.log(images);
      setRecentImages(images);
    } catch (err) {
      setError("Failed to load recent images");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (loading || !isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
            Dashboard
          </h1>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/upload"
              className="bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-sm"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Image
            </Link>
            <Link
              href="/search"
              className="bg-gray-800 text-gray-200 px-4 py-2.5 rounded-lg hover:bg-gray-700 transition-colors flex items-center shadow-sm border border-gray-700"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Link>
            <Link
              href="/groups"
              className="bg-gray-800 text-gray-200 px-4 py-2.5 rounded-lg hover:bg-gray-700 transition-colors flex items-center shadow-sm border border-gray-700"
            >
              <Users className="w-4 h-4 mr-2" />
              Face Groups
            </Link>
          </div>
        </div>

        {/* Storage Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800/50 p-6 rounded-xl shadow-sm border border-gray-700/50 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold mb-3 text-gray-200">Storage Usage</h2>
            <div className="mb-3">
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{
                    width: `${(user?.storageUsed || 0) / (user?.maxStorage || 1) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              {formatBytes(user?.storageUsed || 0)} of {formatBytes(user?.maxStorage || 0)}
            </p>
          </div>
          
          <div className="bg-gray-800/50 p-6 rounded-xl shadow-sm border border-gray-700/50 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold mb-3 text-gray-200">Image Count</h2>
            <div className="mb-3">
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{
                    width: `${(user?.imageCount || 0) / (user?.maxImages || 1) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              {user?.imageCount || 0} of {user?.maxImages || 0} images
            </p>
          </div>
          
          <div className="bg-gray-800/50 p-6 rounded-xl shadow-sm border border-gray-700/50 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold mb-3 text-gray-200">Account Type</h2>
            <p className="text-2xl font-bold text-blue-400 capitalize">{user?.role || "User"}</p>
            <p className="text-sm text-gray-400 mt-2">
              {user?.role === "ADMIN" ? "Full access to all features" : "Standard user access"}
            </p>
          </div>
        </div>

        {/* Recent Images */}
        <div className="bg-gray-800/50 p-6 rounded-xl shadow-sm border border-gray-700/50">
          <h2 className="text-lg font-semibold mb-6 text-gray-200">Recent Images</h2>
          
          {error && (
            <div className="bg-red-900/50 text-red-200 p-4 rounded-lg mb-6 text-sm flex items-center border border-red-800/50">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              {error}
            </div>
          )}
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-500 border-t-transparent"></div>
            </div>
          ) : recentImages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {recentImages.map((image) => (
                <div key={image.id} className="group border border-gray-700/50 rounded-xl overflow-hidden hover:shadow-md transition-shadow bg-gray-800/30">
                  <div className="aspect-square relative bg-gray-700">
                    <Image
                      src={image.url}
                      alt={image.label || "Uploaded image"}
                      layout="fill"
                      objectFit="cover"
                      className="group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-200 truncate">{image.label || "Untitled"}</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(image.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex justify-end mt-3 space-x-3">
                      <button className="text-gray-400 hover:text-blue-400 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ImageIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-3">No images uploaded yet</p>
              <Link
                href="/upload"
                className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center transition-colors"
              >
                Upload your first image
                <Upload className="w-4 h-4 ml-2" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 