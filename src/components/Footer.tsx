import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} FaceVault. All rights reserved.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <Link 
              href="/about" 
              className="text-gray-400 hover:text-blue-400 transition-colors"
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className="text-gray-400 hover:text-blue-400 transition-colors"
            >
              Contact Us
            </Link>
            <Link 
              href="/privacy" 
              className="text-gray-400 hover:text-blue-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms" 
              className="text-gray-400 hover:text-blue-400 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 