"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface OnboardingContextType {
  showOnboarding: boolean;
  completeOnboarding: () => void;
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;
  totalSteps: number;
  setShowOnboarding: (show: boolean) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 5; // Update this based on your actual number of steps

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding');
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem('hasCompletedOnboarding', 'true');
    setShowOnboarding(false);
    setCurrentStep(0);
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <OnboardingContext.Provider 
      value={{ 
        showOnboarding, 
        completeOnboarding, 
        currentStep,
        nextStep,
        prevStep,
        totalSteps,
        setShowOnboarding
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
} 