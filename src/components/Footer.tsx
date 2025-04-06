import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600">
              &copy; {new Date().getFullYear()} FaceVault. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-4">
            <Link href="/privacy" className="text-gray-600 hover:text-blue-600">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-600 hover:text-blue-600">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-blue-600">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 