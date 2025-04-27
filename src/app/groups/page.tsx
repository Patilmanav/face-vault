"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { AlertCircle, Users, Loader2 } from "lucide-react";
import Image from "next/image";

interface FaceGroup {
  id: string;
  image_urls: string[];
  count: number;
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
      
      const response = await fetch("/api/images/groups", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch face groups");
      }

      const data = await response.json();
      setFaceGroups(data.faceGroups || []);
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
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600 mb-2">Face Groups</h1>
          <p className="text-lg text-gray-400">View and manage your face groups</p>
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
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <span className="ml-2 text-gray-400">Loading face groups...</span>
          </div>
        ) : faceGroups.length === 0 ? (
          <div className="bg-gray-800/50 p-8 rounded-xl shadow-sm border border-gray-700/50 text-center">
            <div className="bg-gray-700 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-lg font-medium text-gray-200 mb-2">No Face Groups Found</h2>
            <p className="text-gray-400 mb-6">
              You haven&#39;t uploaded any images with faces yet.
            </p>
            <button
              onClick={() => router.push("/upload")}
              className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Upload Images
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {faceGroups.map((group) => (
              <div key={group.id} className="bg-gray-800/50 rounded-xl shadow-sm border border-gray-700/50 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Users className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-300">
                        Group {group.id.slice(0, 8)} • {group.count} images
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {group.image_urls.map((url, index) => (
                      <div key={index} className="group relative aspect-square bg-gray-700 rounded-lg overflow-hidden">
                        <Image
                          src={url}
                          alt={`Group image ${index + 1}`}
                          fill
                          className="object-cover transition-transform duration-200 group-hover:scale-105"
                        />
                        {/* <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all"></div> */}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}