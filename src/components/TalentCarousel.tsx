import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCallback } from "react";
import TalentCard from "./TalentCard";

interface Talent {
  name: string;
  category: string;
  price: string;
  image: string;
  description: string;
  rating: number;
}

interface TalentCarouselProps {
  title: string;
  talents: Talent[];
}

const TalentCarousel = ({ title, talents }: TalentCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: "start",
    slidesToScroll: 1,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-bold text-foreground">{title}</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={scrollPrev}
              className="rounded-full hover:bg-accent hover:text-primary transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={scrollNext}
              className="rounded-full hover:bg-accent hover:text-primary transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {talents.map((talent, index) => (
              <div key={index} className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] xl:flex-[0_0_25%]">
                <TalentCard {...talent} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalentCarousel;
