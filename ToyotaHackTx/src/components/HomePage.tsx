import { Navbar } from './Navbar';
import { Button } from './ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HomePageProps {
  onStartQuiz: () => void;
}

export function HomePage({ onStartQuiz }: HomePageProps) {
  const carouselImages = [
    {
      url: 'https://images.unsplash.com/photo-1705747401901-28363172fe7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBzaG93cm9vbXxlbnwxfHx8fDE3NjA4MDM5MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      alt: 'Luxury car showroom',
    },
    {
      url: 'https://images.unsplash.com/photo-1665491641262-53155eaac2b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjYXIlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjA4MjA1Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      alt: 'Modern car interior',
    },
    {
      url: 'https://images.unsplash.com/photo-1646208199109-68610835342d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBjYXIlMjBkcml2aW5nfGVufDF8fHx8MTc2MDgyNDk0MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      alt: 'Sports car driving',
    },
    {
      url: 'https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMGNhciUyMGNoYXJnaW5nfGVufDF8fHx8MTc2MDc4NjA5Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      alt: 'Electric car charging',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        {/* Carousel Section */}
        <div className="max-w-5xl mx-auto mb-16">
          <Carousel className="w-full">
            <CarouselContent>
              {carouselImages.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="relative w-full h-[500px] rounded-lg overflow-hidden">
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
