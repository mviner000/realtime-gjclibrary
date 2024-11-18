"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface Story {
  id: number;
  name: string;
  userImage: string;
}

const stories: Story[] = [
  {
    id: 1,
    name: "John Doe",
    userImage: `https://i.pravatar.cc/40?u=1`,
  },
  {
    id: 2,
    name: "Jane Smith",
    userImage: `https://i.pravatar.cc/40?u=2`,
  },
  {
    id: 3,
    name: "Mike Johnson",
    userImage: `https://i.pravatar.cc/40?u=3`,
  },
  {
    id: 4,
    name: "Emily Brown",
    userImage: `https://i.pravatar.cc/40?u=4`,
  },
  {
    id: 5,
    name: "Daisy Espana",
    userImage: `https://i.pravatar.cc/40?u=5`,
  },
  {
    id: 6,
    name: "Jose Dalipe",
    userImage: `https://i.pravatar.cc/40?u=6`,
  },
  {
    id: 7,
    name: "Ella Caymo",
    userImage: `https://i.pravatar.cc/40?u=7`,
  },
  {
    id: 8,
    name: "Jayvee Baybayon",
    userImage: `https://i.pravatar.cc/40?u=8`,
  },
  {
    id: 9,
    name: "Nestor Cunanan",
    userImage: `https://i.pravatar.cc/40?u=9`,
  },
  {
    id: 10,
    name: "Alex Johnson",
    userImage: `https://i.pravatar.cc/40?u=10`,
  },
];

export default function StoryCard() {
  const [visibleStories, setVisibleStories] = useState<Story[]>([]);
  const [startIndex, setStartIndex] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const updateVisibleStories = (): void => {
      const containerWidth = containerRef.current?.offsetWidth || 0;
      const cardWidth = 180; // Width of each card (160px) + gap (20px)
      const cardsPerView = Math.max(2, Math.floor(containerWidth / cardWidth));
      setVisibleStories(stories.slice(startIndex, startIndex + cardsPerView));
    };

    updateVisibleStories();
    window.addEventListener("resize", updateVisibleStories);
    return () => window.removeEventListener("resize", updateVisibleStories);
  }, [startIndex]);

  const loadMoreStories = (): void => {
    setStartIndex((prevIndex) =>
      Math.min(prevIndex + 1, stories.length - visibleStories.length)
    );
  };

  const loadPreviousStories = (): void => {
    setStartIndex((prevIndex) => Math.max(0, prevIndex - 1));
  };

  const showLeftArrow = startIndex > 0;
  const showRightArrow = startIndex + visibleStories.length < stories.length;

  return (
    <div ref={containerRef} className="w-full relative">
      <ScrollArea className="w-full whitespace-nowrap rounded-md border border-gray-200">
        <div className="flex space-x-5 p-4">
          {visibleStories.map((story) => (
            <div
              key={story.id}
              className="relative flex-shrink-0 w-[140px] sm:w-[160px] h-[210px] sm:h-[240px] rounded-xl overflow-hidden cursor-pointer transition-transform hover:scale-105 bg-gray-100"
            >
              <div className="absolute top-4 left-4">
                <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-white ring-2 ring-gray-200">
                  <AvatarImage src={story.userImage} alt={story.name} />
                  <AvatarFallback>{story.name[0]}</AvatarFallback>
                </Avatar>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl sm:text-6xl font-bold text-gray-300">
                  {story.id}
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-black text-xs sm:text-sm font-medium truncate">
                  {story.name}
                </p>
              </div>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      {showLeftArrow && (
        <div className="absolute top-1/2 left-2 -translate-y-1/2">
          <Button
            onClick={loadPreviousStories}
            className="rounded-full bg-white hover:bg-gray-100 text-gray-600"
            variant="outline"
            size="icon"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Show Previous</span>
          </Button>
        </div>
      )}
      {showRightArrow && (
        <div className="absolute top-1/2 right-2 -translate-y-1/2">
          <Button
            onClick={loadMoreStories}
            className="rounded-full bg-white hover:bg-gray-100 text-gray-600"
            variant="outline"
            size="icon"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Show More</span>
          </Button>
        </div>
      )}
    </div>
  );
}
