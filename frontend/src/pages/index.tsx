import DownloadFile from "@components/DownloadFile";
import DropZoneComponent from "@components/DropZoneComponent";
import Heading from "@components/Heading";
import RenderFile from "@components/RenderFile";
import axios from "axios";
import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [downloadPageLink, setDownloadPageLink] = useState(null);
  const [id, setId] = useState(null);
  const [uploadState, setUploadState] = useState<
    "Uploading" | "Upload Failed" | "Uploaded" | "Upload"
  >("Upload");

  const handleUpload = async () => {
    setUploadState("Uploading");
    const formData = new FormData();
    formData.append("myFile", file);
    try {
      const { data } = await axios.post("/api/files/upload", formData);
      setUploadState("Uploaded");
      setDownloadPageLink(data.downloadPageLink);
      setId(data.id);
    } catch (error) {
      console.log(error.response.data);
      setUploadState("Upload Failed");
    }
  };

    const resetComponent = () => {
      setFile(null);
      setDownloadPageLink(null);
      setUploadState("Upload");
    };

  return (
    <div className="flex flex-col items-center justify-center">
      <Heading />
      <div className="flex flex-col items-center justify-center bg-gray-800 shadow-xl w-96 rounded-xl">
        {/* Drag and Drop Componenet */}
        {!downloadPageLink && <DropZoneComponent setFile={setFile} />}

        {/* renderfile */}
        {file && (
          <RenderFile
            file={{
              format: file.type.split("/")[1],
              name: file.name,
              sizeInBytes: file.size,
            }}
          />
        )}

        {/* upload button */}
        {!downloadPageLink && file && (
          <button
            disabled={
              uploadState === "Uploading" || uploadState === "Uploaded"
                ? true
                : false
            }
            className="button"
            onClick={handleUpload}
            style={{
              cursor:
                uploadState === "Uploading" || uploadState === "Uploaded"
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {uploadState}
          </button>
        )}

        {/* Download Page */}
        {downloadPageLink && (
          <div className="p-2 text-center">
            <DownloadFile downloadPageLink={downloadPageLink} />
            <button className="button" onClick={resetComponent}>
              Upload New File
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
