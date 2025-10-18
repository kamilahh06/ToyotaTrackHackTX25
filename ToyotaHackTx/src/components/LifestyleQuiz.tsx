import { useState } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Checkbox } from './ui/checkbox';

interface LifestyleData {
  carColor: string;
  seats: string;
  range: string;
  accessories: string[];
}

interface LifestyleQuizProps {
  onSubmit: (data: LifestyleData) => void;
  onBack: () => void;
  initialData: LifestyleData;
}

export function LifestyleQuiz({ onSubmit, onBack, initialData }: LifestyleQuizProps) {
  const [formData, setFormData] = useState<LifestyleData>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof LifestyleData, string>>>({});

  const handleInputChange = (field: keyof LifestyleData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user makes a selection
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAccessoryToggle = (accessory: string) => {
    setFormData((prev) => {
      const newAccessories = prev.accessories.includes(accessory)
        ? prev.accessories.filter((a) => a !== accessory)
        : [...prev.accessories, accessory];
      return { ...prev, accessories: newAccessories };
    });
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof LifestyleData, string>> = {};

    if (!formData.carColor) {
      newErrors.carColor = 'Please select a car color';
    }

    if (!formData.seats) {
      newErrors.seats = 'Please select number of seats';
    }

    if (!formData.range) {
      newErrors.range = 'Please select a range preference';
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

  const accessories = [
    { id: 'sunroof', label: 'Sunroof' },
    { id: 'leatherSeats', label: 'Leather Seats' },
    { id: 'heatedSeats', label: 'Heated Seats' },
    { id: 'navigation', label: 'Premium Navigation' },
    { id: 'soundSystem', label: 'Premium Sound System' },
    { id: 'backup', label: 'Backup Camera' },
    { id: 'blindSpot', label: 'Blind Spot Monitoring' },
    { id: 'autopilot', label: 'Autopilot/Driver Assist' },
  ];

  return (
    <Card className="bg-white rounded-lg shadow-lg p-8">
      <div className="mb-8">
        <h1 className="text-red-600 mb-2">Step 2: Car Preferences</h1>
        <p className="text-gray-600">
          Tell us about your ideal vehicle preferences
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="carColor">What Color Car?</Label>
          <Select
            value={formData.carColor}
            onValueChange={(value) => handleInputChange('carColor', value)}
          >
            <SelectTrigger className={`mt-2 ${errors.carColor ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="Select a color" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="black">Black</SelectItem>
              <SelectItem value="white">White</SelectItem>
              <SelectItem value="silver">Silver</SelectItem>
              <SelectItem value="gray">Gray</SelectItem>
              <SelectItem value="red">Red</SelectItem>
              <SelectItem value="blue">Blue</SelectItem>
              <SelectItem value="green">Green</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.carColor && (
            <p className="mt-1 text-red-500">{errors.carColor}</p>
          )}
        </div>

        <div>
          <Label htmlFor="seats">How Many Seats?</Label>
          <Select
            value={formData.seats}
            onValueChange={(value) => handleInputChange('seats', value)}
          >
            <SelectTrigger className={`mt-2 ${errors.seats ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="Select number of seats" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2 Seats</SelectItem>
              <SelectItem value="4">4 Seats</SelectItem>
              <SelectItem value="5">5 Seats</SelectItem>
              <SelectItem value="7">7 Seats</SelectItem>
              <SelectItem value="8">8+ Seats</SelectItem>
            </SelectContent>
          </Select>
          {errors.seats && (
            <p className="mt-1 text-red-500">{errors.seats}</p>
          )}
        </div>

        <div>
          <Label>Long or Short Range?</Label>
          <RadioGroup
            value={formData.range}
            onValueChange={(value) => handleInputChange('range', value)}
            className="mt-3 space-y-3"
          >
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="short" id="short" />
              <Label htmlFor="short" className="cursor-pointer">
                Short Range (City driving, under 200 miles)
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="medium" id="medium" />
              <Label htmlFor="medium" className="cursor-pointer">
                Medium Range (Balanced, 200-350 miles)
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="long" id="long" />
              <Label htmlFor="long" className="cursor-pointer">
                Long Range (Road trips, 350+ miles)
              </Label>
            </div>
          </RadioGroup>
          {errors.range && (
            <p className="mt-1 text-red-500">{errors.range}</p>
          )}
        </div>

        <div>
          <Label>Wanted Accessories</Label>
          <p className="text-gray-600 mt-1 mb-3">Select all that apply</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {accessories.map((accessory) => (
              <div key={accessory.id} className="flex items-center space-x-3">
                <Checkbox
                  id={accessory.id}
                  checked={formData.accessories.includes(accessory.id)}
                  onCheckedChange={() => handleAccessoryToggle(accessory.id)}
                />
                <Label
                  htmlFor={accessory.id}
                  className="cursor-pointer"
                >
                  {accessory.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1"
          >
            Back
          </Button>
          <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-700">
            Continue to Results
          </Button>
        </div>
      </form>
    </Card>
  );
}
