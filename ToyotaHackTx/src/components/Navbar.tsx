import { Button } from './ui/button';
import logoImage from '../assets/toyota_image.png';


export function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Left Aligned */}
          <div className="flex items-center gap-2">
            <img src={logoImage} alt="Toyota Logo" className="h-10" />
          </div>

          {/* Navigation Links - Right Aligned */}
          <div className="flex items-center gap-6">
            <a href="#about" className="text-gray-700 hover:text-red-600 transition-colors">
              About
            </a>
            <a href="#contact" className="text-gray-700 hover:text-red-600 transition-colors">
              Contact
            </a>
            <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
              Account
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
