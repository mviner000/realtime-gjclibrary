import { useState, useEffect } from "react";
import { Picture } from "@/types";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

const RETRIEVE_PICTURE_URL = "/api/picture/retrieve";
const DELETE_PICTURE_URL = "/api/picture/delete";

const RetrievePicture: React.FC = () => {
  const [pictures, setPictures] = useState<Picture[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPictures();
  }, []);

  const fetchPictures = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(RETRIEVE_PICTURE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      if (Array.isArray(data)) {
        setPictures(data);
      } else if (data.pictures) {
        setPictures(data.pictures);
      } else {
        throw new Error("Unexpected data format");
      }
    } catch (error: any) {
      setError(error.message);
      console.error("Error fetching pictures:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (imageId: number) => {
    try {
      const response = await axios.delete(`${DELETE_PICTURE_URL}/${imageId}`);
      if (response.data.message) {
        setPictures(pictures.filter((picture) => picture.id !== imageId));
      }
    } catch (error) {
      console.error("Error deleting picture:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }
  
  return (
    <div>
      {error && <p className="text-red-500">Error: {error}</p>}
      {pictures.length > 0 ? (
        <div className="flex flex-col md:flex-row gap-4">
          <div key={pictures[0].id} className="relative">
            <img
              src={pictures[0].picture_url}
              alt={pictures[0].upload_date}
              className="max-h-[513px] object-cover object-center rounded-md aspect-square"
              loading="lazy"
              style={{
                filter: "blur(20px)",
                transition: "filter 0.3s ease-in-out",
              }}
              onLoad={(e) => {
                (e.target as HTMLImageElement).style.filter = "none";
              }}
            />

            <Button
              size="icon"
              variant="outline"
              className="rounded-full absolute -top-4 -right-4"
              onClick={() => handleDelete(pictures[0].id)}
            >
              <Trash2 className="size-5" />
            </Button>
          </div>
          <div className="flex flex-row md:flex-col gap-4">
            {pictures?.slice(1).map((picture) => (
              <div key={picture.id} className="relative">
                <img
                  src={picture.picture_url}
                  alt={picture.upload_date}
                  className="size-20 md:size-40 object-cover object-center rounded-md aspect-square"
                  loading="lazy"
                  style={{
                    filter: "blur(20px)",
                    transition: "filter 0.3s ease-in-out",
                  }}
                  onLoad={(e) => {
                    (e.target as HTMLImageElement).style.filter = "none";
                  }}
                />

                <Button
                  size="icon"
                  variant="outline"
                  className="rounded-full absolute -top-4 -right-4"
                  onClick={() => handleDelete(pictures[0].id)}
                >
                  <Trash2 className="size-4 md:size-5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Return a placeholder image with the same size as the original image
        <img
          src="images/image-placeholder.svg"
          alt="Placeholder image"
          className="max-h-[513px] object-cover object-center rounded-md aspect-square"
          loading="lazy"
          style={{
            filter: "blur(20px)",
            transition: "filter 0.3s ease-in-out",
          }}
          onLoad={(e) => {
            (e.target as HTMLImageElement).style.filter = "none";
          }}
        />
      )}
    </div>
  );
};

export default RetrievePicture;