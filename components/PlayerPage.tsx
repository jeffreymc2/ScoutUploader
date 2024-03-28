// app/components/PlayerPage.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { supabaseBrowser } from '@/lib/supabase/browser';
import DeletePost from './DeletePost';
import Uploader from './Uploader';

interface PlayerPageProps {
  playerid: number;
  FullName: string;
}

const imgeUrlHost = 'https://rfgveuhgzxqkaualspln.supabase.co/storage/v1/object/public/images/';

export default function PlayerPage({ playerid, FullName }: PlayerPageProps) {
  const [images, setImages] = useState<string[]>([]);
  const router = useRouter();

  const player_id = playerid.toString();

  useEffect(() => {
    const fetchImages = async () => {
      const supabase = supabaseBrowser();
      const { data, error } = await supabase.storage
        .from('images')
        .list(`${player_id}`, {
          limit: 100,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' },
        });

      if (error) {
        console.error('Error fetching images:', error);
      } else {
        setImages(data.map((image) => image.name));
      }
    };

    fetchImages();
  }, [player_id]);

  return (
    <div className="space-y-4">
      <Button onClick={() => router.back()}>Back</Button>
      <h1 className="text-2xl font-bold">Player ID: {player_id}</h1>
      <div className="grid grid-cols-3 gap-4">
        {images.map((image) => (
          <div key={image} className="relative">
            <Image
              src={`${imgeUrlHost}${player_id}/${image}`}
              alt={`Player ${player_id}`}
              width={300}
              height={200}
              className="rounded-md object-cover object-center"
            />
            <div className='p-2'>
            <DeletePost post_by={player_id} image={`${player_id}/${image}`} />
            </div>
          </div>
        ))}
      </div>
      
      <Uploader playerid={playerid} FullName={FullName} />
    </div>
  );
}