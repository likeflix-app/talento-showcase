import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCallback } from "react";
import TalentCard from "./TalentCard";
import { Talent } from "@/types/talent";

interface TalentCarouselProps {
  title: string;
  talents: Talent[];
}

const TalentCarousel = ({ title, talents }: TalentCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: "center",
    slidesToScroll: 1,
    containScroll: "trimSnaps",
    duration: 25,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground font-playfair italic">{title}</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={scrollPrev}
              className="rounded-full border-2 border-primary/20 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={scrollNext}
              className="rounded-full border-2 border-primary/20 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="overflow-hidden -mx-4" ref={emblaRef}>
          <div className="flex">
            {talents.map((talent, index) => (
              <div 
                key={talent.id || index} 
                className="flex-[0_0_76.5%] min-w-0 px-4 sm:flex-[0_0_72.25%] md:flex-[0_0_38.25%] lg:flex-[0_0_28.33%] transition-all duration-500 ease-out"
              >
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
