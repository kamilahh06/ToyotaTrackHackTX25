import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ArrowLeft } from 'lucide-react';

interface AccountPageProps {
  onBack: () => void;
  onStartQuiz: () => void;
  onGoToResults: () => void;
}


export function AccountPage({ onBack, onStartQuiz , onGoToResults}: AccountPageProps) {
  const [signInData, setSignInData] = useState({
    email: '',
    phoneNumber: '',
  });

  const [createAccountData, setCreateAccountData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    ssn: '',
  });

  const [signInErrors, setSignInErrors] = useState<Record<string, string>>({});
  const [createAccountErrors, setCreateAccountErrors] = useState<Record<string, string>>({});

  const handleSignInChange = (field: string, value: string) => {
    setSignInData((prev) => ({ ...prev, [field]: value }));
    if (signInErrors[field]) {
      setSignInErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleCreateAccountChange = (field: string, value: string) => {
    setCreateAccountData((prev) => ({ ...prev, [field]: value }));
    if (createAccountErrors[field]) {
      setCreateAccountErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    return /^\d{10}$/.test(phone.replace(/\D/g, ''));
  };

  const validateSSN = (ssn: string) => {
    return /^\d{9}$/.test(ssn.replace(/\D/g, ''));
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!signInData.email) {
      errors.email = 'Email is required';
    } else if (!validateEmail(signInData.email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!signInData.phoneNumber) {
      errors.phoneNumber = 'Phone number is required';
    } else if (!validatePhone(signInData.phoneNumber)) {
      errors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }

    setSignInErrors(errors);

    if (Object.keys(errors).length === 0) {
      // Handle sign in logic here
      console.log('Sign in:', signInData);
      alert('Sign in successful!');
      onGoToResults();
    }
  };

  const handleCreateAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!createAccountData.name) {
      errors.name = 'Name is required';
    }

    if (!createAccountData.email) {
      errors.email = 'Email is required';
    } else if (!validateEmail(createAccountData.email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!createAccountData.phoneNumber) {
      errors.phoneNumber = 'Phone number is required';
    } else if (!validatePhone(createAccountData.phoneNumber)) {
      errors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }

    if (!createAccountData.password) {
      errors.password = 'Password is required';
    } else if (createAccountData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (!createAccountData.ssn) {
      errors.ssn = 'SSN is required';
    } else if (!validateSSN(createAccountData.ssn)) {
      errors.ssn = 'Please enter a valid 9-digit SSN';
    }

    setCreateAccountErrors(errors);

    if (Object.keys(errors).length === 0) {
      // Handle create account logic here
      console.log('Create account:', createAccountData);
      alert('Account created successfully!');

      // Navigate to quiz page
        onStartQuiz();
    }
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };

  const formatSSN = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 5) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(5, 9)}`;
  };

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-red-600 mb-6">Account</h1>

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="create">Create Account</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignInSubmit} className="space-y-6 mt-6">
                <div>
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={signInData.email}
                    onChange={(e) => handleSignInChange('email', e.target.value)}
                    className={`mt-2 ${signInErrors.email ? 'border-red-500' : ''}`}
                  />
                  {signInErrors.email && (
                    <p className="mt-1 text-red-500">{signInErrors.email}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="signin-phone">Phone Number</Label>
                  <Input
                    id="signin-phone"
                    type="tel"
                    placeholder="123-456-7890"
                    value={signInData.phoneNumber}
                    onChange={(e) =>
                      handleSignInChange('phoneNumber', formatPhoneNumber(e.target.value))
                    }
                    className={`mt-2 ${signInErrors.phoneNumber ? 'border-red-500' : ''}`}
                    maxLength={12}
                  />
                  {signInErrors.phoneNumber && (
                    <p className="mt-1 text-red-500">{signInErrors.phoneNumber}</p>
                  )}
                </div>

                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                  Sign In
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="create">
              <form onSubmit={handleCreateAccountSubmit} className="space-y-6 mt-6">
                <div>
                  <Label htmlFor="create-name">Full Name</Label>
                  <Input
                    id="create-name"
                    type="text"
                    placeholder="John Doe"
                    value={createAccountData.name}
                    onChange={(e) => handleCreateAccountChange('name', e.target.value)}
                    className={`mt-2 ${createAccountErrors.name ? 'border-red-500' : ''}`}
                  />
                  {createAccountErrors.name && (
                    <p className="mt-1 text-red-500">{createAccountErrors.name}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="create-email">Email</Label>
                  <Input
                    id="create-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={createAccountData.email}
                    onChange={(e) => handleCreateAccountChange('email', e.target.value)}
                    className={`mt-2 ${createAccountErrors.email ? 'border-red-500' : ''}`}
                  />
                  {createAccountErrors.email && (
                    <p className="mt-1 text-red-500">{createAccountErrors.email}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="create-phone">Phone Number</Label>
                  <Input
                    id="create-phone"
                    type="tel"
                    placeholder="123-456-7890"
                    value={createAccountData.phoneNumber}
                    onChange={(e) =>
                      handleCreateAccountChange('phoneNumber', formatPhoneNumber(e.target.value))
                    }
                    className={`mt-2 ${createAccountErrors.phoneNumber ? 'border-red-500' : ''}`}
                    maxLength={12}
                  />
                  {createAccountErrors.phoneNumber && (
                    <p className="mt-1 text-red-500">{createAccountErrors.phoneNumber}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="create-password">Password</Label>
                  <Input
                    id="create-password"
                    type="password"
                    placeholder="••••••••"
                    value={createAccountData.password}
                    onChange={(e) => handleCreateAccountChange('password', e.target.value)}
                    className={`mt-2 ${createAccountErrors.password ? 'border-red-500' : ''}`}
                  />
                  {createAccountErrors.password && (
                    <p className="mt-1 text-red-500">{createAccountErrors.password}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="create-ssn">Social Security Number</Label>
                  <Input
                    id="create-ssn"
                    type="text"
                    placeholder="123-45-6789"
                    value={createAccountData.ssn}
                    onChange={(e) =>
                      handleCreateAccountChange('ssn', formatSSN(e.target.value))
                    }
                    className={`mt-2 ${createAccountErrors.ssn ? 'border-red-500' : ''}`}
                    maxLength={11}
                  />
                  {createAccountErrors.ssn && (
                    <p className="mt-1 text-red-500">{createAccountErrors.ssn}</p>
                  )}
                  <p className="mt-1 text-gray-600">Required for credit verification</p>
                </div>

                <Button 
                type="submit" 
                className="w-full bg-red-600 hover:bg-red-700" 
                >
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </main>
  );
}