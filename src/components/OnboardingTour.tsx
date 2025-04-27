"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useOnboarding } from "@/providers/OnboardingProvider";
import { X, ArrowLeft, ArrowRight, Check } from "lucide-react";

interface TourStep {
  target: string;
  title: string;
  content: string;
  position: "top" | "right" | "bottom" | "left";
}

const tourSteps: TourStep[] = [
  {
    target: "dashboard-header",
    title: "Welcome to FaceVault",
    content: "This is your dashboard where you can manage your face images and see your storage usage.",
    position: "bottom",
  },
  {
    target: "storage-stats",
    title: "Storage Statistics",
    content: "Here you can see how much storage you've used and how many images you've uploaded.",
    position: "right",
  },
  {
    target: "upload-button",
    title: "Upload Images",
    content: "Click here to upload new images. FaceVault will automatically detect and group faces in your images.",
    position: "left",
  },
  {
    target: "search-button",
    title: "Search by Face",
    content: "Use this feature to search for images containing specific faces in your collection.",
    position: "left",
  },
  {
    target: "face-groups-button",
    title: "Face Groups",
    content: "View and manage all your images grouped by detected faces. Add labels and organize your collection.",
    position: "left",
  },
];

export default function OnboardingTour() {
  const { showOnboarding, currentStep, nextStep, prevStep, totalSteps, setShowOnboarding } = useOnboarding();
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);

  const highlightCurrentStep = useCallback(() => {
    // Remove previous highlight
    if (highlightedElement) {
      highlightedElement.classList.remove("onboarding-highlight");
    }

    // Find and highlight the current step's target element
    const targetElement = document.getElementById(tourSteps[currentStep].target);
    if (targetElement) {
      targetElement.classList.add("onboarding-highlight");
      setHighlightedElement(targetElement);
      
      // Position the tooltip
      positionTooltip(targetElement, tourSteps[currentStep].position);
    }
  }, [currentStep, highlightedElement]);

  const positionTooltip = useCallback((element: HTMLElement, position: string) => {
    if (!tooltipRef.current) return;

    const elementRect = element.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    
    let top = 0;
    let left = 0;

    switch (position) {
      case "top":
        top = elementRect.top - tooltipRect.height - 10;
        left = elementRect.left + (elementRect.width / 2) - (tooltipRect.width / 2);
        break;
      case "right":
        top = elementRect.top + (elementRect.height / 2) - (tooltipRect.height / 2);
        left = elementRect.right + 10;
        break;
      case "bottom":
        top = elementRect.bottom + 10;
        left = elementRect.left + (elementRect.width / 2) - (tooltipRect.width / 2);
        break;
      case "left":
        top = elementRect.top + (elementRect.height / 2) - (tooltipRect.height / 2);
        left = elementRect.left - tooltipRect.width - 10;
        break;
    }

    // Ensure tooltip stays within viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (left < 10) left = 10;
    if (left + tooltipRect.width > viewportWidth - 10) left = viewportWidth - tooltipRect.width - 10;
    if (top < 10) top = 10;
    if (top + tooltipRect.height > viewportHeight - 10) top = viewportHeight - tooltipRect.height - 10;

    setTooltipPosition({ top, left });
  }, []);

  useEffect(() => {
    if (showOnboarding) {
      highlightCurrentStep();
    }
  }, [showOnboarding, currentStep, highlightCurrentStep]);

  if (!showOnboarding) return null;

  const currentTourStep = tourSteps[currentStep];

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={nextStep} />
      
      <div 
        ref={tooltipRef}
        className="fixed z-50 bg-gray-800 text-white p-4 rounded-lg shadow-lg max-w-xs transition-all duration-300"
        style={{ 
          top: `${tooltipPosition.top}px`, 
          left: `${tooltipPosition.left}px`,
          opacity: highlightedElement ? 1 : 0
        }}
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{currentTourStep.title}</h3>
          <button 
            onClick={() => setShowOnboarding(false)}
            className="text-gray-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>
        
        <p className="text-gray-300 mb-4">{currentTourStep.content}</p>
        
        <div className="flex justify-between items-center">
          <div className="flex space-x-1">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full ${i === currentStep ? 'bg-blue-500' : 'bg-gray-600'}`}
              />
            ))}
          </div>
          
          <div className="flex space-x-2">
            {currentStep > 0 && (
              <button 
                onClick={prevStep}
                className="p-1 rounded-full bg-gray-700 hover:bg-gray-600"
              >
                <ArrowLeft size={16} />
              </button>
            )}
            
            <button 
              onClick={nextStep}
              className="p-1 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center"
            >
              {currentStep === totalSteps - 1 ? <Check size={16} /> : <ArrowRight size={16} />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
} 