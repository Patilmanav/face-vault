import React, { useState } from 'react';
import { useOnboarding } from '@/providers/OnboardingProvider';
import Image from 'next/image';

const steps = [
  {
    title: 'Welcome to Face Vault',
    description: 'Your secure face recognition vault for managing and organizing your photos.',
    image: '/onboarding/welcome.svg',
  },
  {
    title: 'Upload Your Photos',
    description: 'Easily upload your photos to the vault. We support various image formats.',
    image: '/onboarding/upload.svg',
  },
  {
    title: 'Organize with Tags',
    description: 'Tag your photos to keep them organized and easily searchable.',
    image: '/onboarding/tags.svg',
  },
  {
    title: 'Search by Face',
    description: 'Find photos of specific people using our advanced face recognition technology.',
    image: '/onboarding/search.svg',
  },
  {
    title: 'Secure Storage',
    description: 'Your photos are securely stored and encrypted in the vault.',
    image: '/onboarding/security.svg',
  },
];

export function OnboardingModal() {
  const { showOnboarding, completeOnboarding } = useOnboarding();
  const [currentStep, setCurrentStep] = useState(0);

  if (!showOnboarding) return null;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{steps[currentStep].title}</h2>
          <button
            onClick={handleSkip}
            className="text-gray-500 hover:text-gray-700"
          >
            Skip
          </button>
        </div>
        <div className="mb-8 relative h-64">
          <Image
            src={steps[currentStep].image}
            alt={steps[currentStep].title}
            fill
            className="object-contain"
            priority
          />
        </div>
        <p className="text-gray-600 mb-8">{steps[currentStep].description}</p>
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentStep ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          <button
            onClick={handleNext}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
} 