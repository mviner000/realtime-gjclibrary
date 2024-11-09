import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

const UPLOAD_PICTURE_URL = "/api/picture/upload";

const UploadPicture: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files ? event.target.files[0] : null);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(UPLOAD_PICTURE_URL, formData);
      setUploading(false);
      if (response.data.message) {
        setSuccess(response.data.message);
        window.location.reload();

        //   turn on this for development mode pre
        //   console.log(response.data);
      }
    } catch (error) {
      setUploading(false);
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        setError(
          error.response.data.error ||
          "An account can only have up to 3 pictures."
        );
      } else {
        setError("Error uploading image");
      }
      //   turn on this for development mode pre
      //   console.error("Error uploading image", error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <Button
        className="mt-2 bg-customGreen2 hover:bg-customGreen2/90"
        onClick={handleUpload}
        disabled={!file || uploading} // Disable if no file or currently uploading
      >
        {uploading ? "Uploading..." : "Upload Picture"}
      </Button>
      {uploading ? (
        <p>Uploading...</p>
      ) : (
        <>
          {success && (
            <p style={{ color: "green" }}>{success} Refresh Page please</p>
          )}{" "}
          {/* Display success message */}
          {error && <p style={{ color: "red" }}>{error}</p>}{" "}
          {/* Display error message */}
          {!success && !error && <p>Select a file to upload</p>}
        </>
      )}
    </div>
  );
};

export default UploadPicture;
