export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
          Privacy Policy
        </h1>
        
        <div className="space-y-8">
          <section className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">1. Information We Collect</h2>
            <p className="text-gray-300 leading-relaxed">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc list-inside mt-2 text-gray-300 space-y-2">
              <li>Account information (name, email, password)</li>
              <li>Face images and associated metadata</li>
              <li>Usage data and analytics</li>
            </ul>
          </section>

          <section className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">2. How We Use Your Information</h2>
            <p className="text-gray-300 leading-relaxed">
              We use the collected information to:
            </p>
            <ul className="list-disc list-inside mt-2 text-gray-300 space-y-2">
              <li>Provide and maintain our services</li>
              <li>Process and store your face images</li>
              <li>Improve our face recognition algorithms</li>
              <li>Send you important updates and notifications</li>
            </ul>
          </section>

          <section className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">3. Data Security</h2>
            <p className="text-gray-300 leading-relaxed">
              We implement appropriate security measures to protect your personal information, including:
            </p>
            <ul className="list-disc list-inside mt-2 text-gray-300 space-y-2">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments</li>
              <li>Access controls and authentication</li>
              <li>Secure data storage practices</li>
            </ul>
          </section>

          <section className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">4. Your Rights</h2>
            <p className="text-gray-300 leading-relaxed">
              You have the right to:
            </p>
            <ul className="list-disc list-inside mt-2 text-gray-300 space-y-2">
              <li>Access your personal data</li>
              <li>Request correction of your data</li>
              <li>Request deletion of your data</li>
              <li>Object to data processing</li>
            </ul>
          </section>

          <section className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">5. Contact Us</h2>
            <p className="text-gray-300 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="mt-2 text-gray-300">
              Email: privacy@facevault.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
} 