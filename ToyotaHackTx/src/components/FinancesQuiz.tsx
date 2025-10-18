import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface FinancesData {
  monthlyIncome: string;
  creditScore: string;
  idealMonthlyPayment: string;
  pastDebt: string;
}

interface FinancesQuizProps {
  onSubmit: (data: FinancesData) => void;
  initialData: FinancesData;
}

export function FinancesQuiz({ onSubmit, initialData }: FinancesQuizProps) {
  const [formData, setFormData] = useState<FinancesData>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof FinancesData, string>>>({});

  const handleInputChange = (field: keyof FinancesData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof FinancesData, string>> = {};

    if (!formData.monthlyIncome || parseFloat(formData.monthlyIncome) <= 0) {
      newErrors.monthlyIncome = 'Please enter a valid monthly income';
    }

    if (!formData.creditScore) {
      newErrors.creditScore = 'Please select your credit score range';
    }

    if (!formData.idealMonthlyPayment || parseFloat(formData.idealMonthlyPayment) <= 0) {
      newErrors.idealMonthlyPayment = 'Please enter a valid monthly payment';
    }

    if (!formData.pastDebt || parseFloat(formData.pastDebt) < 0) {
      newErrors.pastDebt = 'Please enter your past debt (or 0 if none)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Card className="bg-white rounded-lg shadow-lg p-8">
      <div className="mb-8">
        <h1 className="text-red-600 mb-2">Step 1: Financial Information</h1>
        <p className="text-gray-600">
          Let's start by understanding your financial situation
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="monthlyIncome">Monthly Income</Label>
          <div className="relative mt-2">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <Input
              id="monthlyIncome"
              type="number"
              placeholder="5000"
              value={formData.monthlyIncome}
              onChange={(e) => handleInputChange('monthlyIncome', e.target.value)}
              className={`pl-8 ${errors.monthlyIncome ? 'border-red-500' : ''}`}
              step="0.01"
            />
          </div>
          {errors.monthlyIncome && (
            <p className="mt-1 text-red-500">{errors.monthlyIncome}</p>
          )}
        </div>

        <div>
          <Label htmlFor="creditScore">Credit Score Range</Label>
          <Select
            value={formData.creditScore}
            onValueChange={(value) => handleInputChange('creditScore', value)}
          >
            <SelectTrigger className={`mt-2 ${errors.creditScore ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="Select your credit score range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="excellent">Excellent (750+)</SelectItem>
              <SelectItem value="good">Good (700-749)</SelectItem>
              <SelectItem value="fair">Fair (650-699)</SelectItem>
              <SelectItem value="poor">Poor (600-649)</SelectItem>
              <SelectItem value="verypoor">Very Poor (Below 600)</SelectItem>
            </SelectContent>
          </Select>
          {errors.creditScore && (
            <p className="mt-1 text-red-500">{errors.creditScore}</p>
          )}
        </div>

        <div>
          <Label htmlFor="idealMonthlyPayment">Ideal Monthly Payment</Label>
          <div className="relative mt-2">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <Input
              id="idealMonthlyPayment"
              type="number"
              placeholder="500"
              value={formData.idealMonthlyPayment}
              onChange={(e) => handleInputChange('idealMonthlyPayment', e.target.value)}
              className={`pl-8 ${errors.idealMonthlyPayment ? 'border-red-500' : ''}`}
              step="0.01"
            />
          </div>
          {errors.idealMonthlyPayment && (
            <p className="mt-1 text-red-500">{errors.idealMonthlyPayment}</p>
          )}
        </div>

        <div>
          <Label htmlFor="pastDebt">Past Debt</Label>
          <div className="relative mt-2">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <Input
              id="pastDebt"
              type="number"
              placeholder="0"
              value={formData.pastDebt}
              onChange={(e) => handleInputChange('pastDebt', e.target.value)}
              className={`pl-8 ${errors.pastDebt ? 'border-red-500' : ''}`}
              step="0.01"
            />
          </div>
          {errors.pastDebt && (
            <p className="mt-1 text-red-500">{errors.pastDebt}</p>
          )}
        </div>

        <div className="pt-4">
          <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
            Continue to Lifestyle Quiz
          </Button>
        </div>
      </form>
    </Card>
  );
}
