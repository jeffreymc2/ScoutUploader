'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import ReactPlayer from 'react-player';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

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
    const videoExtensions = ['.mp4', '.webm', '.ogg'];
    return videoExtensions.some((extension) => url.toLowerCase().endsWith(extension));
  };

  const getThumbnailFromVideo = (videoUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.src = videoUrl;
      video.crossOrigin = 'anonymous';
      video.addEventListener('loadedmetadata', () => {
        video.currentTime = 0;
      });
      video.addEventListener('seeked', () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const thumbnail = canvas.toDataURL('image/png');
          resolve(thumbnail);
        } else {
          reject(new Error('Failed to create canvas context'));
        }
      });
      video.addEventListener('error', (error) => {
        reject(error);
      });
      video.load();
    });
  };

  useEffect(() => {
    
    if (isVideoFile(file.image)) {
      getThumbnailFromVideo(file.image)
        .then((thumbnail) => {
          setThumbnailUrl(thumbnail);
        })
        .catch((error) => {
          console.error('Error generating thumbnail:', error);
        });
    }
  }, [file.image]);

  if (isVideoFile(file.image)) {

  return (
    <>
    <Dialog>
      <DialogTrigger>

        <div className="relative aspect-square w-full h-48 cursor-pointer">
          {isVideoFile(file.image) ? (

            <Image
              src={thumbnailUrl}
              alt={`Video thumbnail posted by ${file.post_by || 'Unknown'}`}
              fill
              className="rounded-lg object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
            />
          ) : (
            <Image
              src={file.image}
              alt={`Image posted by ${file.post_by || 'Unknown'}`}
              fill
              className="rounded-lg object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
            />
            
          )}
          {isVideoFile(file.image) && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black bg-opacity-50 rounded-full p-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="white"
                  width="48px"
                  height="48px"
                >
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <ReactPlayer url={file.image} controls width="100%" height="auto" />
      </DialogContent>
    </Dialog>
    </>
    );
  } else {
    return (
      <div className="relative aspect-square w-full h-48">
        <Image
          src={file.image}
          alt={`Image posted by ${file.post_by || 'Unknown'}`}
          fill
          className="rounded-lg object-cover"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
        />
      </div>
    );
  }
};

export default MediaRenderer;

