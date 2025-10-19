import { Button } from './ui/button';
import { Card } from './ui/card';
import { CheckCircle2 } from 'lucide-react';
import { ChatBot } from './ChatBot';

interface FinancesData {
  monthlyIncome: string;
  creditScore: string;
  idealMonthlyPayment: string;
  pastDebt: string;
}

interface LifestyleData {
  carColor: string;
  seats: string;
  range: string;
  accessories: string[];
}

interface ResultsPageProps {
 financesData: FinancesData;
  lifestyleData: LifestyleData;
  aiRecommendation: string | null;
 recommendedCars: { 
  name: string;
  image: string;
  price: number;
  seats: number;
  range: string;
}[];
  onStartOver: () => void;
}

export function ResultsPage({ financesData,
  lifestyleData,
  onStartOver,
  aiRecommendation,
  recommendedCars, }: ResultsPageProps) {
        // ADD THESE DEBUG LOGS
      console.log("🎯 ResultsPage received cars:", recommendedCars);
      console.log("🎯 Number of cars:", recommendedCars.length);

  // Calculate sample financing based on inputs
  const monthlyIncome = parseFloat(financesData.monthlyIncome) || 0;
  const idealPayment = parseFloat(financesData.idealMonthlyPayment) || 0;
  
  // Sample calculation logic
  const calculateDownPayment = () => {
    const creditScoreMultiplier = {
      excellent: 0.05,
      good: 0.10,
      fair: 0.15,
      poor: 0.20,
      verypoor: 0.25,
    };
    const basePrice = idealPayment * 60; // Assuming 60 month loan
    return basePrice * (creditScoreMultiplier[financesData.creditScore as keyof typeof creditScoreMultiplier] || 0.15);
  };


  const downPayment = calculateDownPayment();
  const estimatedMonthlyPayment = idealPayment;

 

  const accessoryLabels: { [key: string]: string } = {
    sunroof: 'Sunroof',
    leatherSeats: 'Leather Seats',
    heatedSeats: 'Heated Seats',
    navigation: 'Premium Navigation',
    soundSystem: 'Premium Sound System',
    backup: 'Backup Camera',
    blindSpot: 'Blind Spot Monitoring',
    autopilot: 'Autopilot/Driver Assist',
  };

  return (
    <div className="space-y-8">

      {/* Summary Header */}
      <Card className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="w-16 h-16 text-green-600" />
          </div>
          <h1 className="text-red-600 mb-2">Your Personalized Results</h1>
          <p className="text-gray-600">
            Based on your preferences, here are your recommended financing options
          </p>
        </div>

        {/* Financial Overview */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="text-center p-6 bg-red-50 rounded-lg">
            <p className="text-gray-600 mb-2">Recommended Down Payment</p>
            <p className="text-red-600">${downPayment.toFixed(0)}</p>
          </div>
          <div className="text-center p-6 bg-red-50 rounded-lg">
            <p className="text-gray-600 mb-2">Estimated Monthly Payment</p>
            <p className="text-red-600">${estimatedMonthlyPayment.toFixed(0)}/mo</p>
          </div>
          <div className="text-center p-6 bg-red-50 rounded-lg">
            <p className="text-gray-600 mb-2">Loan Term</p>
            <p className="text-red-600">60 months</p>
          </div>
        </div>
      </Card>

      {/* Vehicle Preferences Summary */}
      <Card className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-red-600 mb-4">Your Vehicle Preferences</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Preferred Color:</p>
            <p className="capitalize">{lifestyleData.carColor}</p>
          </div>
          <div>
            <p className="text-gray-600">Number of Seats:</p>
            <p>{lifestyleData.seats} seats</p>
          </div>
          <div>
            <p className="text-gray-600">Range Preference:</p>
            <p className="capitalize">{lifestyleData.range} range</p>
          </div>
          <div>
            <p className="text-gray-600">Desired Accessories:</p>
            <p>
              {lifestyleData.accessories.length > 0
                ? lifestyleData.accessories.map(acc => accessoryLabels[acc]).join(', ')
                : 'None selected'}
            </p>
          </div>
        </div>
      </Card>

      {/* Car Recommendations */}
      <div>
        <h2 className="text-red-600 mb-6">Recommended Vehicles</h2>
          {/* ADD THIS DEBUG INFO */}
          {recommendedCars.length === 0 && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
              <p className="font-bold">Debug: No cars found</p>
              <p>Check console for details</p>
            </div>
                )}
              
        <div className="grid md:grid-cols-3 gap-6">
          {recommendedCars.map((car, index) => (
          <Card key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={car.image}
              alt={car.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="mb-2">{car.name}</h3>
              <p className="text-gray-600 mb-2">Starting at ${car.price.toLocaleString()}</p>
              <p className="text-gray-600">{car.seats} seats</p>
              <p className="text-gray-600 capitalize">Range: {car.range}</p>
              <Button className="w-full mt-4 bg-red-600 hover:bg-red-700">
                Learn More
              </Button>
            </div>
          </Card>
        ))}
        </div>
      </div>

      {/* Chatbot Section */}
      <div>
        <h2 className="text-red-600 mb-6">Have Questions? Chat with your Personal Assistant!</h2>
        <ChatBot />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 pt-4">
        <Button
          onClick={onStartOver}
          variant="outline"
          className="border-red-600 text-red-600 hover:bg-red-50"
        >
          Start Over
        </Button>
        <Button className="bg-red-600 hover:bg-red-700">
          Contact a Dealer
        </Button>
      </div>
    </div>
  );
}