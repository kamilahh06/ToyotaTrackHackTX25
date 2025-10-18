import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { StepIndicator } from './components/StepIndicator';
import { FinancesQuiz } from './components/FinancesQuiz';
import { LifestyleQuiz } from './components/LifestyleQuiz';
import { ResultsPage } from './components/ResultsPage';

export default function App() {
  const [showQuiz, setShowQuiz] = useState(false);
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

  const handleStartQuiz = () => {
    setShowQuiz(true);
    setCurrentStep(1);
  };

  const handleFinancesSubmit = (data: typeof financesData) => {
    setFinancesData(data);
    setCurrentStep(2);
  };

  const handleLifestyleSubmit = (data: typeof lifestyleData) => {
    setLifestyleData(data);
    setCurrentStep(3);
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleStartOver = () => {
    setShowQuiz(false);
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
      <Navbar />
      
      {!showQuiz ? (
        <HomePage onStartQuiz={handleStartQuiz} />
      ) : (
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
                onStartOver={handleStartOver}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
