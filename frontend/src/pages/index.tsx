import DropZoneComponent from "@components/DropZoneComponent";
import Heading from "@components/Heading"
import RenderFile from "@components/RenderFile";
import { useState } from "react";

export default function Home() {
    const [file, setFile] = useState(null);
  return (
    <div className="flex flex-col items-center justify-center">
      <Heading />
      <div className="flex flex-col items-center justify-center bg-gray-800 shadow-xl w-96 rounded-xl">
        {/* Drag and Drop Componenet */}
        <DropZoneComponent setFile={setFile} />
        
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
      </div>
    </div>
  );
}
