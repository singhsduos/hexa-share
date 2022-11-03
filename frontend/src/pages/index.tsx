import DropZoneComponent from "@components/DropZoneComponent";
import Heading from "@components/Heading"
import { useState } from "react";

export default function Home() {
    const [file, setFile] = useState(null);
  return (
    <div className="flex flex-col items-center justify-center">
      <Heading />
      <div className="flex flex-col items-center justify-center bg-gray-800 shadow-xl w-96 rounded-xl">
        <DropZoneComponent setFile={setFile} />
        {/* renderfile */}
        {/* upload button */}
      </div>
    </div>
  );
}
