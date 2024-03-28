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

  // Define isVideoFile as a function declaration
  function isVideoFile(url: string) {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.flv', '.wmv'];
    return videoExtensions.some(extension => url.toLowerCase().endsWith(extension));
  }

  useEffect(() => {
    if (isVideoFile(file.image)) {
      const video = document.createElement('video');
      video.src = file.image;
      video.crossOrigin = 'anonymous'; // Ensure CORS policies allow this
      video.preload = 'metadata';
      video.style.position = 'absolute';
      video.style.width = '0';
      video.style.height = '0';
      video.style.top = '0';
      video.style.left = '-10000px'; // Off-screen
  
      // Append the video to the body to ensure it's part of the DOM
      document.body.appendChild(video);
  
      video.onloadedmetadata = () => {
        // After metadata loads, seek to a frame
        video.currentTime = 1;
      };
  
      video.onseeked = () => {
        // Introduce a slight delay before capturing the thumbnail
        setTimeout(() => {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
          const thumbnail = canvas.toDataURL('image/png');
          setThumbnailUrl(thumbnail);
  
          // Remove the video element after capturing the thumbnail
          document.body.removeChild(video);
        }, 1000); // Adjust delay as necessary
      };
  
      video.onerror = () => {
        console.error('Error loading video for thumbnail generation');
        // Consider removing the video element in case of error as well
        document.body.removeChild(video);
      };
    } else {
      // Directly set the thumbnailUrl for non-video files
      setThumbnailUrl(file.image);
    }
  }, [file.image]);
  

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className="relative aspect-square w-full h-48 cursor-pointer" onClick={() => setIsOpen(true)}>
            <Image
              src={thumbnailUrl || 'https://rfgveuhgzxqkaualspln.supabase.co/storage/v1/object/public/misc/pg-video.jpg'} // Use the direct or generated thumbnail
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
