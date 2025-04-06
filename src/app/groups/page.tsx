"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { AlertCircle, Users, Loader2 } from "lucide-react";

interface FaceGroup {
  id: string;
  label: string;
  details: string;
  imageUrls: string[];
}

export default function GroupsPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  
  const [faceGroups, setFaceGroups] = useState<FaceGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isAuthenticated) {
      fetchFaceGroups();
    }
  }, [isAuthenticated, loading, router]);

  const fetchFaceGroups = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      // For testing purposes, use the mock API
      // In production, use the real API: "/api/images/groups"
      const response = await fetch("/api/mock/groups", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch face groups");
      }

      const data = await response.json();
      
      if (data.success) {
        setFaceGroups(data.faceGroups || []);
      } else {
        throw new Error(data.message || "Failed to fetch face groups");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch face groups");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || !isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Face Groups</h1>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <span className="ml-2 text-gray-600">Loading face groups...</span>
        </div>
      ) : faceGroups.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-lg font-medium mb-2">No Face Groups Found</h2>
          <p className="text-gray-600 mb-4">
            You haven't uploaded any images with faces yet.
          </p>
          <button
            onClick={() => router.push("/upload")}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Upload Images
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {faceGroups.map((group) => (
            <div key={group.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-start mb-4">
                <div className="flex-1">
                  <h2 className="text-lg font-medium mb-1">{group.label || "Unnamed Group"}</h2>
                  {group.details && (
                    <p className="text-gray-600 text-sm mb-2">{group.details}</p>
                  )}
                </div>
                
                <div className="ml-4 flex items-center">
                  <Users className="w-5 h-5 text-gray-400 mr-1" />
                  <span className="text-sm text-gray-500">{group.imageUrls.length} images</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {group.imageUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Group ${group.id} image ${index + 1}`}
                      className="w-full h-32 object-cover rounded"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 