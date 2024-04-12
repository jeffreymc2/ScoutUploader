"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { supabaseBrowser } from '@/lib/supabase/browser';
import DeletePost from './DeletePost';
import Uploader from './Uploader';

interface FileData {
  name: string;
  url: string;
}

interface PlayerPageProps {
  playerid: number;
  FullName: string;
}

const imageUrlHost = process.env.NEXT_PUBLIC_SUPABASE_URL+'/storage/v1/object/public/images/';

export default function PlayerPage({ playerid, FullName }: PlayerPageProps) {
  const [files, setFiles] = useState<FileData[]>([]);
  const router = useRouter();
  const supabase = supabaseBrowser();

  useEffect(() => {
    const fetchFiles = async () => {
      const { data, error } = await supabase.storage
        .from('images')
        .list(playerid.toString(), {
          limit: 100,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' },
        });

      if (error) {
        console.error('Error fetching files:', error);
        return;
      }

      setFiles(data.map((file) => ({
        name: file.name,
        url: `${imageUrlHost}${playerid}/${file.name}`,
      })));
    };

    fetchFiles();
  }, [playerid]);

  return (
    <div className="space-y-4">
      <Button onClick={() => router.back()}>Back</Button>
      <h1 className="text-2xl font-bold">Player ID: {playerid}</h1>
      <div className="grid grid-cols-3 gap-4">
        {files.map((file, index) => {
          // Check if the file URL ends with a video file extension
          if (/\.(mp4|webm|ogg)$/i.test(file.url)) {
            return (
              <div key={index} className="relative">
                {/* Render video player for video files */}
                <video src={file.url} width="100%" height="auto" controls />
                <DeletePost post_by={playerid.toString()} image={file.url} />
              </div>
            );
          } else {
            return (
              <div key={index} className="relative">
                {/* Render image for other file types */}
                <Image
                  src={file.url}
                  alt={`File ${index}`}
                  width={300}
                  height={200}
                  layout="responsive"
                  objectFit="cover"
                />
                <DeletePost post_by={playerid.toString()} image={file.url} />
              </div>
            );
          }
        })}
      </div>
      <Uploader playerid={playerid} FullName={FullName} thumbnailUrl={""} />
    </div>
  );
}