"use client";
import {
  CSSProperties,
  forwardRef,
  HTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";
import { HighlightVideo } from "@/lib/types/types";
import { Card } from "../ui/card";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ReactPlayer from "react-player";
import {
  RiAddCircleLine,
  RiSubtractLine,
  RiDragMove2Line,
} from "react-icons/ri";

type Props = {
  video: HighlightVideo;
  isInPlaylist: boolean;
  onAddRemove: () => void;
  isOpacityEnabled?: boolean;
  isDragging?: boolean;
  dragHandleProps?: any;
} & HTMLAttributes<HTMLDivElement>;

const HighlightVideoItem = forwardRef<HTMLDivElement, Props>(
  function HighlightVideoItem(
    {
      video,
      isInPlaylist,
      onAddRemove,
      isOpacityEnabled,
      isDragging,
      style,
      dragHandleProps,
      ...props
    },
    ref
  ) {
    const [isOpen, setIsOpen] = useState(false);
    const playerRef = useRef<ReactPlayer | null>(null);

    const handleDialogOpen = () => {
      setIsOpen(true);
    };

    const handleDialogClose = () => {
      setIsOpen(false);
    };

    const handleReady = () => {
      if (playerRef.current) {
        const internalPlayer = playerRef.current.getInternalPlayer("hls");
        if (internalPlayer) {
          internalPlayer.currentLevel = -1; // Set initial quality level to the highest
        }
      }

      if (playerRef.current && video.start_time !== undefined) {
        playerRef.current.seekTo(video.start_time, "seconds");
      }
    };

    const handleProgress = (state: { playedSeconds: number }) => {
      if (
        playerRef.current &&
        video.duration &&
        state.playedSeconds >= video.start_time + video.duration
      ) {
        playerRef.current.getInternalPlayer()?.pause();
      }
    };

    const getTitleWithoutBrackets = (title: string) => {
      const bracketRegex = /\[(.+?)\]/;
      const match = title.match(bracketRegex);
      return match ? match[1] : title;
    };

    const getTitle = (title: string) => {
      const bracketRegex = /\[(.+?)\]/;
      const match = title.match(bracketRegex);
      return match ? title.replace(match[0], "") : title;
    };

    const filterDescription = (description: string | undefined) => {
      if (description) {
        return description.replace(/9999/g, "");
      }
      return description;
    };

    const styles: CSSProperties = {
      opacity: isOpacityEnabled ? "0.4" : "1",
      cursor: isDragging ? "grabbing" : "grab",
      ...style,
    };

    return (
      <>
        <div className="grid">
          <Card className="flex items-center gap-2 rounded-lg bg-white mb-2 p-2">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <div onClick={handleDialogOpen}>
                  <Image
                    src={
                      video.thumbnailUrl ||
                      "https://avkhdvyjcweghosyfiiw.supabase.co/storage/v1/object/public/misc/638252106298352027-DKPlusHP%20(1).webp"
                    }
                    alt="Image"
                    width={125}
                    height={50}
                    className="rounded-lg cursor-pointer max-h-[75px] object-cover"
                  />
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[850px]">
                <DialogHeader>
                  <DialogTitle>
                    {getTitleWithoutBrackets(video.title)}
                  </DialogTitle>
                  <DialogDescription>
                    {filterDescription(video.description)}
                  </DialogDescription>
                </DialogHeader>
                <div className="relative w-full h-0 pb-[56.25%] border rounded-b-lg p-0">
                  <ReactPlayer
                    ref={playerRef}
                    className="rounded-lg absolute top-0 left-0"
                    url={video.url}
                    playing={isOpen}
                    controls={true}
                    width={"100%"}
                    height={"100%"}
                    style={{ objectFit: "fill" }}
                    onReady={handleReady}
                    onProgress={handleProgress}
                    config={{
                      file: {
                        attributes: {
                          crossOrigin: "anonymous",
                        },
                        hlsOptions: {
                          autoStartLoad: true, // Start loading the video immediately
                          startPosition: -1, // Start from the beginning of the video
                          capLevelToPlayerSize: true, // Adjust quality based on player size
                          maxBufferLength: 30,
                          maxMaxBufferLength: 60,
                        },
                      },
                    }}
                  />
                </div>
              </DialogContent>
            </Dialog>
            <div className="flex-1">
              {video.title && (
                <p className="text-sm leading-4 font-bold text-gray-600 mt-2 truncate-text">
                  {getTitle(video.title)}
                </p>
              )}
              {filterDescription(video.description) && (
                <p className="text-xs mt-1 truncate-text">
                  {filterDescription(video.description)}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {isInPlaylist ? (
                <RiSubtractLine
                  className="text-xl text-red-500 cursor-pointer"
                  onClick={onAddRemove}
                />
              ) : (
                <RiAddCircleLine
                  className="text-xl text-green-500 cursor-pointer"
                  onClick={onAddRemove}
                />
              )}
              {dragHandleProps && (
                <RiDragMove2Line
                  className="text-2xl text-gray-400 touch-auto"
                  {...dragHandleProps}
                />
              )}
            </div>
          </Card>
        </div>
      </>
    );
  }
);

export { HighlightVideoItem };