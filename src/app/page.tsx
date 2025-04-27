import Link from "next/link";
import { Search, Upload, Shield, Database, Users, Settings } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-gray-900/0"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
            Secure Face Recognition Database
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            FaceVault provides a secure and efficient way to manage and search face images in your database. Perfect for organizations that need to maintain a searchable database of face images with associated metadata.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/register"
              className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 rounded-lg text-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
            >
              Get Started
            </Link>
            <Link
              href="/about"
              className="bg-gray-800 text-gray-100 hover:bg-gray-700 px-6 py-3 rounded-lg text-lg font-medium transition-all duration-300 border border-gray-700"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-800/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-100">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 group">
              <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                <Search className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-100">Face Recognition Search</h3>
              <p className="text-gray-400 leading-relaxed">
                Quickly search your database using face recognition technology to find matches.
              </p>
            </div>
            <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 group">
              <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                <Upload className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-100">Easy Image Upload</h3>
              <p className="text-gray-400 leading-relaxed">
                Upload images with automatic face detection and add labels and details.
              </p>
            </div>
            <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 group">
              <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                <Shield className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-100">Secure Storage</h3>
              <p className="text-gray-400 leading-relaxed">
                Your data is stored securely with role-based access control and encryption.
              </p>
            </div>
            <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 group">
              <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                <Database className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-100">Metadata Management</h3>
              <p className="text-gray-400 leading-relaxed">
                Add and manage labels and details for each image in your database.
              </p>
            </div>
            <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 group">
              <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                <Users className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-100">User Management</h3>
              <p className="text-gray-400 leading-relaxed">
                Create user accounts with different permission levels and storage quotas.
              </p>
            </div>
            <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 group">
              <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                <Settings className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-100">Admin Dashboard</h3>
              <p className="text-gray-400 leading-relaxed">
                Comprehensive admin tools to manage users, storage, and system settings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-gray-900/0"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-bold mb-6 text-gray-100">Ready to Get Started?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join FaceVault today and experience the power of secure face recognition database management.
          </p>
          <Link
            href="/register"
            className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-4 rounded-lg text-lg font-medium inline-block transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
          >
            Create Your Account
          </Link>
        </div>
      </section>
    </div>
  );
}
