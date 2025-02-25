import { formatFileSize } from "@/app/utils/helper";
import { FileText, X } from "lucide-react";
import React from "react";

const Preview = ({
  media,
  messageType,
  setMedia,
  setMessageType,
}: {
  media: any;
  messageType: any;
  setMedia: any;
  setMessageType: any;
}) => {
  const getFileExtension = (filename: string): string => {
    return filename?.split(".").pop()?.toUpperCase() || "";
  };

  const clearPreview = () => {
    setMedia(null);
    setMessageType("text");
  };

  return (
    <>
      {media && messageType !== "text" && (
        <div className="border-t h-full">
          <div className="container h-full mx-auto p-4">
            <div className="relative rounded-lg h-full overflow-hidden p-4">
              <button
                onClick={clearPreview}
                className="absolute top-2 right-2 p-1.5 rounded-full dark:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>

              {messageType === "image" && (
                <div className="flex flex-col justify-center h-full items-center">
                  <img
                    src={URL.createObjectURL(media)}
                    alt="Preview"
                    className="max-h-[450px] rounded-lg object-cover shadow-lg"
                  />
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    {media.name}
                  </p>
                </div>
              )}

              {messageType === "video" && (
                <div className="flex flex-col justify-center h-full items-center">
                  <video
                    src={URL.createObjectURL(media)}
                    controls
                    className="max-h-[450px] rounded-lg shadow-lg"
                  />
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    {media.name}
                  </p>
                </div>
              )}

              {messageType === "document" && (
                <div className="flex justify-center items-center h-full">
                  <div className="flex flex-col max-w-md w-full rounded-lg border overflow-hidden">
                    {/* Document Header */}
                    <div className="flex items-center gap-3 p-3 ">
                      <div className="w-12 h-12 flex items-center justify-center border rounded-full">
                        <span className="text-xs font-medium">
                          {getFileExtension(media.name)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {media.name}
                        </p>
                        <p className="text-xs">{formatFileSize(media.size)}</p>
                      </div>
                    </div>

                    {/* Document Footer */}
                    <div className="flex items-center justify-between px-3 py-3 border-t dark:border-gray-700">
                      <span className="text-xs">
                        {media.type.split("/")[1].toUpperCase()}
                      </span>
                      <FileText className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Preview;
