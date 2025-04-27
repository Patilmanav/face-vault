export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
          Terms of Service
        </h1>
        
        <div className="space-y-8">
          <section className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">1. Acceptance of Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              By accessing and using FaceVault, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this service.
            </p>
          </section>

          <section className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">2. Use License</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Permission is granted to temporarily access FaceVault for personal or commercial use, subject to the following restrictions:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>You must not modify or copy the materials</li>
              <li>You must not use the materials for any unlawful purpose</li>
              <li>You must not attempt to reverse engineer any software</li>
              <li>You must not remove any copyright or proprietary notations</li>
            </ul>
          </section>

          <section className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">3. User Responsibilities</h2>
            <p className="text-gray-300 leading-relaxed">
              As a user of FaceVault, you are responsible for:
            </p>
            <ul className="list-disc list-inside mt-2 text-gray-300 space-y-2">
              <li>Maintaining the confidentiality of your account</li>
              <li>All activities that occur under your account</li>
              <li>Ensuring you have the right to upload any images</li>
              <li>Complying with all applicable laws and regulations</li>
            </ul>
          </section>

          <section className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">4. Service Limitations</h2>
            <p className="text-gray-300 leading-relaxed">
              FaceVault reserves the right to:
            </p>
            <ul className="list-disc list-inside mt-2 text-gray-300 space-y-2">
              <li>Modify or discontinue the service at any time</li>
              <li>Limit access to certain features or content</li>
              <li>Remove content that violates these terms</li>
              <li>Suspend or terminate accounts as needed</li>
            </ul>
          </section>

          <section className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">5. Disclaimer</h2>
            <p className="text-gray-300 leading-relaxed">
              The materials on FaceVault are provided on an &apos;as is&apos; basis. FaceVault makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">6. Contact Information</h2>
            <p className="text-gray-300 leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <p className="mt-2 text-gray-300">
              Email: legal@facevault.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
} 