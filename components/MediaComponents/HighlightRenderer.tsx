// app/components/MediaComponents/HighlightMediaRenderer.tsx

"use client";
import React, { useState } from "react";
import ReactPlayer from "react-player";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PlayCircleIcon } from "lucide-react";
import { HighlightVideo } from "@/lib/types/types";
import Image from "next/image";
import { Card, CardContent, CardTitle } from "../ui/card";

interface HighlightMediaRendererProps {
  highlight: HighlightVideo;
}

const HighlightMediaRenderer: React.FC<HighlightMediaRendererProps> = ({
  highlight,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className="relative w-full h-48 shadow-sm rounded-lg cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        {!isOpen ? (
          <>
          <Card className="m-0 p-0">
            <CardContent className="object-cover m-0 p-0">
              <CardTitle>Highlight</CardTitle>
            <Image
              src={highlight.thumbnailUrl || "/placeholder.png"}
              alt={`Thumbnail for ${highlight.title || "Highlight"}`}
              fill={true}
              className="rounded-lg object-cover"
            />
            <div className="px-4 pb-4 pt-2">
              <p className="text-md mt-2 leading-3 font-bold text-gray-700">
                {highlight.title}
              </p>
              <p className="text-xs mt-1">{highlight.description}</p>
            </div>
            </CardContent>
            </Card>
          </>
        ) : (
          <Image
            src={highlight.thumbnailUrl || "/placeholder.png"}
            alt={`Thumbnail for ${highlight.title || "Highlight"}`}
            fill={true}
            className="rounded-lg object-cover"
          />
        )}
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="min-h-[50vh] sm:min-h-[66vh] bg-white border-0 border-transparent">
          {isOpen && (
            <div className="relative w-full min-h-[50vh] border rounded-b-lg p-0">
              <ReactPlayer
                className="rounded-lg absolute top-0 left-0"
                url={highlight.url}
                width="100%"
                height="100%"
                controls
                playing={isOpen}
                start={highlight.start_time}
                duration={highlight.duration}
              />
            </div>
          )}

          <div className="px-4 pb-4 pt-2">
            {highlight.title && (
              <p className="text-md mt-2 leading-3 font-bold text-gray-700">
                {highlight.title}
              </p>
            )}
            {highlight.description && (
              <p className="text-xs mt-1">{highlight.description}</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HighlightMediaRenderer;
