import { useState } from 'react';
import { HomePage } from './components/HomePage';
import { StepIndicator } from './components/StepIndicator';
import { FinancesQuiz } from './components/FinancesQuiz';
import { LifestyleQuiz } from './components/LifestyleQuiz';

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

  if (!showQuiz) {
    return <HomePage onStartQuiz={handleStartQuiz} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <StepIndicator currentStep={currentStep} />
        
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
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <h2 className="mb-4">Results</h2>
              <p className="text-gray-600">Coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
