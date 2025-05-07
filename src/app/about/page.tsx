import React from 'react';
import { Github, Linkedin, Send, Globe } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600 mb-8">
            About Face Vault
          </h1>
        </div>
        
        <div className="bg-gray-800/50 shadow rounded-xl p-8 space-y-6 border border-gray-700/50">
          {/* Developer Profile Section */}
          <section className="text-center mb-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-200 mb-2">Developer Profile</h2>
              <p className="text-gray-400">
                Face Vault is developed by Manav Patil, a passionate Python Developer and Software Engineer.
              </p>
            </div>
            <div className="flex justify-center space-x-4">
              <a
                href="https://github.com/patilmanav"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                title="GitHub"
              >
                <Github className="w-6 h-6" />
              </a>
              <a
                href="https://www.linkedin.com/in/manav-patil/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a
                href="https://my-portfolio-n82i.onrender.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                title="Portfolio"
              >
                <Globe className="w-6 h-6" />
              </a>
              <a
                href="https://telegram.me/patilmanav22"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                title="Telegram"
              >
                <Send className="w-6 h-6" />
              </a>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-200 mb-4">Our Mission</h2>
            <p className="text-gray-400">
              Face Vault is dedicated to providing advanced facial recognition technology for secure and efficient identity verification. Our platform offers state-of-the-art face matching capabilities designed to enhance security and streamline authentication processes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-200 mb-4">Current Service Status</h2>
            <div className="bg-yellow-900/50 border-l-4 border-yellow-500 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-200">
                    <strong>Notice:</strong> Our facial recognition feature is currently operating in a limited capacity due to infrastructure requirements.
                  </p>
                </div>
              </div>
            </div>
            <p className="text-gray-400">
              Due to the computational intensity of our facial recognition system, we are currently unable to run the backend services on standard hosting platforms. We are actively working on optimizing our infrastructure to provide a more sustainable solution.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-200 mb-4">Get Started</h2>
            <p className="text-gray-400 mb-4">
              While we work on scaling our infrastructure, we're offering private demonstrations of our facial recognition capabilities. To experience the full potential of Face Vault:
            </p>
            <ul className="list-disc pl-5 text-gray-400 space-y-2">
              <li>Fill out our Contact Us form to request a demo</li>
              <li>Our team will schedule a private demonstration</li>
              <li>We'll provide access to our dedicated server for testing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-200 mb-4">Contact Us</h2>
            <p className="text-gray-400">
              Ready to see Face Vault in action? Reach out to us through our contact form, and we'll arrange a personalized demonstration of our facial recognition technology.
            </p>
            <div className="mt-6">
              <a
                href="/contact"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Contact Us
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 