import { Button } from './ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import myCarImage from '../assets/haha.png';
import myCarImage2 from '../assets/haha2.png';
import myCarImage3 from '../assets/haha3.png';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HomePageProps {
  onStartQuiz: () => void;
}

export function HomePage({ onStartQuiz }: HomePageProps) {
  const carouselImages = [
    {
      url: myCarImage,
      alt: 'Want the dealership experience from home?',
    },
    {
      url: myCarImage2,
      alt: 'Modern car interior',
    },
    {
      url: myCarImage3,
      alt: 'Sports car driving',
    },
  ];

  return (
    <div>
      <main className="container mx-auto px-4 py-12">
        {/* Carousel Section */}
        <div className="max-w-3xl mx-auto mb-6">
          <Carousel className="w-full">
            <CarouselContent>
              {carouselImages.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="relative w-full h-[25vh] rounded-lg overflow-hidden">
                    <ImageWithFallback
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>

        {/* CTA Section */}
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-red-600 mb-4">Take Your Quiz Today</h1>
          <p className="text-gray-700 mb-8">
            Discover the perfect vehicle financing option tailored to your lifestyle and budget. 
            Our simple 3-step quiz helps match you with the ideal car and payment plan.
          </p>
          <Button
            onClick={onStartQuiz}
            className="bg-red-600 hover:bg-red-700 px-8 py-6"
          >
            Start Quiz
          </Button>
        </div>
      </main>
    </div>
  );
}