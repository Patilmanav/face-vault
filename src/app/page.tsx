import Link from "next/link";
import { Search, Upload, Shield, Database, Users, Settings } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Secure Face Recognition Database
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            FaceVault provides a secure and efficient way to manage and search face images in your database. Perfect for organizations that need to maintain a searchable database of face images with associated metadata.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/register"
              className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 rounded-md text-lg font-medium"
            >
              Get Started
            </Link>
            <Link
              href="/about"
              className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-6 py-3 rounded-md text-lg font-medium"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Face Recognition Search</h3>
              <p className="text-gray-600">
                Quickly search your database using face recognition technology to find matches.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Image Upload</h3>
              <p className="text-gray-600">
                Upload images with automatic face detection and add labels and details.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Storage</h3>
              <p className="text-gray-600">
                Your data is stored securely with role-based access control and encryption.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Database className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Metadata Management</h3>
              <p className="text-gray-600">
                Add and manage labels and details for each image in your database.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">User Management</h3>
              <p className="text-gray-600">
                Create user accounts with different permission levels and storage quotas.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Settings className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Admin Dashboard</h3>
              <p className="text-gray-600">
                Comprehensive admin tools to manage users, storage, and system settings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join FaceVault today and experience the power of secure face recognition database management.
          </p>
          <Link
            href="/register"
            className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-3 rounded-md text-lg font-medium inline-block"
          >
            Create Your Account
          </Link>
        </div>
      </section>
    </div>
  );
}
