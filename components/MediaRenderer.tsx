'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import ReactPlayer from 'react-player';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { PlayCircleIcon } from 'lucide-react';

interface MediaRendererProps {
  file: {
    id: string;
    image: string;
    post_by: string;
  };
}

const MediaRenderer: React.FC<MediaRendererProps> = ({ file }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState('');

  const isVideoFile = (url: string) => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.flv', '.wmv'];
    return videoExtensions.some(extension => url.toLowerCase().endsWith(extension));
  };

  useEffect(() => {
    if (isVideoFile(file.image)) {
      const video = document.createElement('video');
      video.src = file.image;
      video.crossOrigin = 'anonymous'; // Make sure CORS policies allow this
      video.preload = 'metadata';

      const updateThumbnail = () => {
        video.currentTime =0; // Seek to middle of the video
      };

      video.onloadedmetadata = () => {
        // Ensure the video is ready and has metadata loaded
        updateThumbnail();
      };

      video.onseeked = () => {
        // Once the video has seeked to the desired time, capture the frame
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        const thumbnail = canvas.toDataURL('image/png');
        setThumbnailUrl(thumbnail);
      };

      // Load the video to trigger metadata loading
      video.load();
    }
  }, [file.image]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className="relative aspect-square w-full h-48 cursor-pointer" onClick={() => setIsOpen(true)}>
            <Image
              src={thumbnailUrl || 'https://rfgveuhgzxqkaualspln.supabase.co/storage/v1/object/public/misc/pg-video.jpg'} // Fallback thumbnail
              alt={`Thumbnail posted by ${file.post_by || 'Unknown'}`}
              fill={true}
              className="rounded-lg object-cover"
            />
            {isVideoFile(file.image) && (
              <div className="absolute inset-0 flex items-center justify-center">
                <PlayCircleIcon className="w-12 h-12 text-white" />
              </div>
            )}
          </div>
        </DialogTrigger>
        {isVideoFile(file.image) && (
          <DialogContent className="sm:max-w-[425px]">
            <ReactPlayer url={file.image} controls width="100%" height="auto" />
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

export default MediaRenderer;
