"use client";

import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { Picture } from "@/types";
import { useRef, useState, useEffect } from "react";

const RETRIEVE_PICTURE_URL = "/api/picture/retrieve";

const CardImage = ({ src }: { src: string }) => (
    <figure className="p-1">
        <img
            src={src || 'https://via.placeholder.com/128x185/007bff/ffffff?text=Photos'}
            alt="pictures_image"
            width={136}
            height={56} // Fixed the height to be a number
            sizes="(max-width: 768px) 100vw, 33vw"
            className="rounded-md w-auto md:w-48 h-56 object-cover transition-all hover:scale-105"
        />
    </figure>
);

const CarouselGallery = () => {
    const [pictures, setPictures] = useState<Picture[]>([]);
    const [error, setError] = useState<string | null>(null);
    const autoplayPlugin = useRef(
        Autoplay({ delay: 3000, stopOnInteraction: true })
    );

    useEffect(() => {
        fetchPictures();
    }, []);

    const fetchPictures = async () => {
        try {
            const response = await fetch(RETRIEVE_PICTURE_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();

            // Assuming the API returns an array of pictures directly
            if (Array.isArray(data)) {
                setPictures(data);
            } else if (data.pictures && Array.isArray(data.pictures)) {
                setPictures(data.pictures);
            } else {
                throw new Error('Unexpected data format');
            }
        } catch (error: any) {
            setError(error.message);
            console.error('Error fetching pictures:', error);
        }
    };

    return (
        <div className="md:mx-10 md:pt-3">
            {error && <p>Error loading images: {error}</p>}
            <Carousel
                plugins={[autoplayPlugin.current]}
                className="w-full max-w p-5 mx-auto"
                onMouseEnter={autoplayPlugin.current.stop}
                onMouseLeave={autoplayPlugin.current.reset}
            >
                <CarouselContent className="w-[220px] h-[280px] xxs:w-[334px] xxs:h-[334px]">
                    {pictures.length > 0 ? (
                        pictures.map((picture, index) => (
                            <CarouselItem key={index}>
                                <Card>
                                    <CardContent className="flex aspect-square items-center justify-center p-1">
                                        {picture.picture_url ? (
                                            <CardImage src={picture.picture_url} />
                                        ) : (
                                            <div>No image available</div>
                                        )}
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        ))
                    ) : (
                        <div>No pictures available</div>
                    )}
                </CarouselContent>
                <CarouselPrevious className="-left-2 xxs:-left-3" />
                <CarouselNext className="-right-2" />
            </Carousel>
        </div>
    );
};

export default CarouselGallery;
