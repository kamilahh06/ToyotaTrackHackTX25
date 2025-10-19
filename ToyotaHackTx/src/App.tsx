import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { StepIndicator } from './components/StepIndicator';
import { FinancesQuiz } from './components/FinancesQuiz';
import { LifestyleQuiz } from './components/LifestyleQuiz';
import { ResultsPage } from './components/ResultsPage';
import { AccountPage } from './components/AccountPage';
// import express from "express";


type PageView = 'home' | 'quiz' | 'account';

export default function App() {

  
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [currentStep, setCurrentStep] = useState(1);
  const [financesData, setFinancesData] = useState({
    monthlyIncome: '',
    creditScore: '',
    idealMonthlyPayment: '',
    pastDebt: '',
  });
  const [lifestyleData, setLifestyleData] = useState({
    carColor: '',
    seats: '',
    range: '',
    accessories: [] as string[],
  });
  const [aiRecommendation, setAiRecommendation] = useState<string | null>(null);
  const [recommendedCars, setRecommendedCars] = useState<any[]>([]);


  const handleStartQuiz = () => {
    setCurrentPage('quiz');
    setCurrentStep(1);
  };

  const handleAccountClick = () => {
    setCurrentPage('account');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  const handleFinancesSubmit = (data: typeof financesData) => {
    setFinancesData(data);
    setCurrentStep(2);
  };

  // const handleLifestyleSubmit = async  (data: typeof lifestyleData) => {
    
  //    setLifestyleData(data);

  // const payload = {
  //   income: financesData.monthlyIncome,
  //   creditScore: financesData.creditScore,
  //   lifestyle: data,
  //   preferredType: "SUV",
    
  // };

  // try {
  //   const res = await fetch("http://localhost:8080/api/recommend", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(payload),
  //   });

    

  //   if (!res.ok) {
  //     throw new Error("Failed to fetch recommendation");
  //   }

  //   const result = await res.json();
  //   console.log("Fetched AI Result:", result);
  //   console.log("✅ Recommendation response:", result);
  //   console.log("🚗 Recommended cars:", result.models); // ADD THIS LINE
  //   console.log("📝 AI text:", result.recommendationContent); // ADD THIS LINE
  //  setAiRecommendation(result.recommendationContent);
  //   setRecommendedCars(result.models);
  // } catch (err) {
  //   console.error("AI fetch error:", err);
  //   setAiRecommendation("Sorry, we couldn't generate a recommendation at this time.");
  // }

  // setCurrentStep(3);
  // };
  const handleLifestyleSubmit = async (data: typeof lifestyleData) => {
    setLifestyleData(data);
  
    try {
      // 🔴 CHANGE THIS LINE - use port 5000, not 8080
      const response = await fetch("http://localhost:8080/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          income: financesData.monthlyIncome,
          creditScore: financesData.creditScore,
          lifestyle: data,
          preferredType: "sedan",
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log("✅ Recommendation response:", result);
  
      setAiRecommendation(result.recommendationContent || null);
      setRecommendedCars(result.models || []);
  
      setCurrentStep(3);
    } catch (err: any) {
      console.error("❌ Error fetching recommendations:", err);
      alert(`Failed to load recommendations: ${err.message}`);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleStartOver = () => {
    setCurrentPage('home');
    setCurrentStep(1);
    setFinancesData({
      monthlyIncome: '',
      creditScore: '',
      idealMonthlyPayment: '',
      pastDebt: '',
    });
    setLifestyleData({
      carColor: '',
      seats: '',
      range: '',
      accessories: [],
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <Navbar onAccountClick={handleAccountClick} />
      
      {currentPage === 'home' && (
        <HomePage onStartQuiz={handleStartQuiz} />
      )}

      {currentPage === 'account' && (
        <AccountPage 
      onBack={handleBackToHome} 
      onStartQuiz={handleStartQuiz} 
      onGoToResults={() => {
      setCurrentPage('quiz');
      setCurrentStep(3);
    }}
  />
      )}

      {currentPage === 'quiz' && (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          {currentStep < 3 && <StepIndicator currentStep={currentStep} />}
          
          <div className="mt-12">
            {currentStep === 1 && (
              <FinancesQuiz onSubmit={handleFinancesSubmit} initialData={financesData} />
            )}
            {currentStep === 2 && (
              <LifestyleQuiz
                onSubmit={handleLifestyleSubmit}
                onBack={handleBack}
                initialData={lifestyleData}
              />
            )}
            {currentStep === 3 && (
              <ResultsPage
                 financesData={financesData}
                lifestyleData={lifestyleData}
                aiRecommendation={aiRecommendation}
                recommendedCars={recommendedCars}
                onStartOver={handleStartOver}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}