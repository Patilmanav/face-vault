"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import Link from "next/link";
import { Upload, Search, Image as ImageIcon, Trash2, Edit, AlertCircle, Users } from "lucide-react";
import Image from "next/image";

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
      // Call your Flask API to get recent images
      const response = await fetch("/api/images/recent", {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch recent images");
      }
      
      const data = await response.json();
      setRecentImages(data);
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
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex space-x-4">
          <Link
            href="/upload"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Image
          </Link>
          <Link
            href="/search"
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 flex items-center"
          >
            <Search className="w-4 h-4 mr-2" />
            Search
          </Link>
          <Link
            href="/groups"
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 flex items-center"
          >
            <Users className="w-4 h-4 mr-2" />
            Face Groups
          </Link>
        </div>
      </div>

      {/* Storage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Storage Usage</h2>
          <div className="mb-2">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{
                  width: `${(user?.storageUsed || 0) / (user?.maxStorage || 1) * 100}%`,
                }}
              ></div>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            {formatBytes(user?.storageUsed || 0)} of {formatBytes(user?.maxStorage || 0)}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Image Count</h2>
          <div className="mb-2">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{
                  width: `${(user?.imageCount || 0) / (user?.maxImages || 1) * 100}%`,
                }}
              ></div>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            {user?.imageCount || 0} of {user?.maxImages || 0} images
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Account Type</h2>
          <p className="text-2xl font-bold text-blue-600 capitalize">{user?.role || "User"}</p>
          <p className="text-sm text-gray-600 mt-1">
            {user?.role === "ADMIN" ? "Full access to all features" : "Standard user access"}
          </p>
        </div>
      </div>

      {/* Recent Images */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Recent Images</h2>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : recentImages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {recentImages.map((image) => (
  <div key={image.id} className="border rounded-lg overflow-hidden">
    <div className="aspect-square relative bg-gray-100">
      <Image
        src={image.url}
        alt={image.label || "Uploaded image"}
        layout="fill" // Ensures the image fills the container
        objectFit="cover" // Maintains aspect ratio and covers the container
      />
    </div>
    <div className="p-3">
      <h3 className="font-medium truncate">{image.label || "Untitled"}</h3>
      <p className="text-xs text-gray-500">
        {new Date(image.createdAt).toLocaleDateString()}
      </p>
      <div className="flex justify-end mt-2 space-x-2">
        <button className="text-gray-500 hover:text-blue-600">
          <Edit className="w-4 h-4" />
        </button>
        <button className="text-gray-500 hover:text-red-600">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
))}
          </div>
        ) : (
          <div className="text-center py-8">
            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No images uploaded yet</p>
            <Link
              href="/upload"
              className="text-blue-600 hover:text-blue-800 font-medium mt-2 inline-block"
            >
              Upload your first image
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 