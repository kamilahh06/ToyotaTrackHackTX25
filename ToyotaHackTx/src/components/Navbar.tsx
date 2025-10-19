import { Button } from './ui/button';
import logoImage from '../assets/toyota_image.png';

interface NavbarProps {
  onAccountClick?: () => void;
}

export function Navbar({ onAccountClick }: NavbarProps) {
  return (
    <nav className="bg-white shadow-sm border-b">
  <div className="container mx-auto px-4 py-4 flex items-center relative">
    {/* Logo - Left */}
    <div className="flex items-center">
      <a href="/">
        <img src={logoImage} alt="Toyota Logo" className="h-10" />
      </a>
    </div>

    {/* Center Title */}
    <div className="flex-1 text-center">
      <span className="text-red-600 text-lg font-semibold">
        Your Toyota, Your Journey – Let's Go Places
      </span>
    </div>

    {/* Right Nav Links */}
    <div className="flex items-center gap-6">
      <a href="https://www.toyotafinancial.com/us/en.html" className="text-gray-700 hover:text-red-600 transition-colors">
        About
      </a>
      <a href="https://www.toyotafinancial.com/us/en/contact_us.html" className="text-gray-700 hover:text-red-600 transition-colors">
        Contact
      </a>
      <Button
        variant="outline"
        className="border-red-600 text-red-600 hover:bg-red-50"
        onClick={onAccountClick}
      >
        Account
      </Button>
    </div>
  </div>
</nav>
  );
}