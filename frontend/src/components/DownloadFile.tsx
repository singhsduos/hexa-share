import { useAlert } from "react-alert";

const DownloadFile = ({ downloadPageLink }) => {
  const alert = useAlert();

  return (
    <div className="p-1">
      <h1 className="my-2 text-lg font-medium">
        Here is download link!, now share it with your friends to download this
        file.
      </h1>
      <div className="flex space-x-3 flex-row p-2 items-center justify-center h-full space-y-3 border-2 border-dashed border-light rounded-xl ">
        <span className="break-all">{downloadPageLink}</span>
        <img
          src="/images/copy.png"
          alt=""
          className="object-contain w-8 h-8 cursor-pointer"
          onClick={() => { navigator.clipboard.writeText(downloadPageLink);   alert.success("Successfully, Link Copied!");}}
        />
      </div>
    </div>
  );
};

export default DownloadFile;
