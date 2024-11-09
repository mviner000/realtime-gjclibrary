import { useState, useEffect } from "react";
import { Picture } from "@/types";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Trash, Trash2 } from "lucide-react";

// Updated API route for retrieving cropped images
const RETRIEVE_CROPPED_IMAGE_URL = "/api/cropped/retrieve";
const DELETE_PICTURE_URL = "/api/picture/delete";

const RetrieveCroppedImage: React.FC = () => {
  const [croppedImages, setCroppedImages] = useState<Picture[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCroppedImages();
  }, []);

  const fetchCroppedImages = async () => {
    try {
      const response = await fetch(RETRIEVE_CROPPED_IMAGE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      // Assuming the API returns an array of cropped images
      if (Array.isArray(data)) {
        setCroppedImages(data);
      } else {
        throw new Error("Unexpected data format");
      }
    } catch (error: any) {
      setError(error.message);
      console.error("Error fetching cropped images:", error);
    }
  };

  const handleDelete = async (imageId: number) => {
    try {
      const response = await axios.delete(`${DELETE_PICTURE_URL}/${imageId}`);
      if (response.data.message) {
        setCroppedImages(croppedImages.filter((image) => image.id !== imageId));
      }
    } catch (error) {
      console.error("Error deleting cropped image:", error);
    }
  };

  return (
    <div>
      {error && <p className="text-red-500">Error: {error}</p>}
      {croppedImages.length > 0 ? (
        <div className="w-full flex gap-4">
          <div key={croppedImages[0].id} className="w-full relative">
            <img
              src={croppedImages[0].cropped_image_url}
              alt={`Uploaded on ${croppedImages[0].upload_date}`}
              className="h-full w-full aspect-square object-cover rounded-md"
            />
            <Button
              size="icon"
              variant="outline"
              className="rounded-full absolute -top-4 -right-4"
              onClick={() => handleDelete(croppedImages[0].id)}
            >
              <Trash2 className="size-5" />
            </Button>
          </div>
          <div className="flex flex-col gap-4">
            {croppedImages?.slice(1).map((image) => (
              <div key={image.id} className="relative">
                <img
                  src={image.cropped_image_url}
                  alt={`Uploaded on ${image.upload_date}`}
                  className="size-40 aspect-square object-cover rounded-md"
                />
                <Button
                  size="icon"
                  variant="outline"
                  className="rounded-full absolute -top-4 -right-4"
                  onClick={() => handleDelete(image.id)}
                >
                  <Trash2 className="size-5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>No cropped images available.</p>
      )}
    </div>
  );
};

export default RetrieveCroppedImage;
