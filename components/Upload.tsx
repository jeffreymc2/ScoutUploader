'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/browser';
import { toast } from 'sonner';
import useUser from '@/app/hook/useUser';
import Mux from '@mux/mux-node';

export interface PlayerResponse {
  PlayerID: string;
  LastName: string;
  FirstName: string;
  PlayerName: string;
  DOB: string;
}

interface UploaderProps {
  playerid: number;
  FullName: string;
}

const UploadPage: React.FC<UploaderProps> = ({ playerid, FullName }) => {
  const { data: user } = useUser();
  const supabase = supabaseBrowser();
  const [selectedPlayer, setSelectedPlayer] = useState<UploaderProps | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setSelectedPlayer({ playerid, FullName });
  }, [playerid, FullName]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const player_id = playerid.toString();
      const fileNameWithUUID = `${player_id}_${file.name}`;

      try {
        // Upload file to Supabase storage
        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(`players/${user?.id}/${player_id}/${fileNameWithUUID}`, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          console.error('Error uploading file to Supabase:', uploadError);
          continue;
        }

        // Create Mux asset
        const mux = new Mux({
          tokenId: process.env.NEXT_PUBLIC_MUX_TOKEN_ID!,
          tokenSecret: process.env.NEXT_PUBLIC_MUX_TOKEN_SECRET!,
        });

        const insertError = null; // Declare the variable insertError

        const upload = await mux.video.uploads.create({
          new_asset_settings: {
            playback_policy: ['public'],
          },
          cors_origin: '*',
        });

        const asset = await mux.video.assets.retrieve(upload.asset_id ?? '');

        if (insertError) {
          console.error('Error inserting asset details into Supabase:', insertError);
        }

        console.log('File uploaded and details inserted into Supabase');
      } catch (error) {
        console.error('Error processing file:', error);
      }
    }

    setIsUploading(false);
    toast.success('Upload complete!');
    if (window.location.pathname.includes('/players')) {
      window.location.reload();
    }
  };

  return (
    <div className="space-y-5">
      <div className="space-y-5">
        <h1 className="font-pgFont text-2xl">Perfect Game Scout Profile Uploader</h1>
        <div>
          <p>Selected Player: {FullName} | Player ID: {playerid}</p>
        </div>
      </div>
      <input
        type="file"
        multiple
        accept="image/*, video/*"
        onChange={handleFileChange}
        disabled={isUploading}
      />
      {isUploading && <p>Uploading...</p>}
    </div>
  );
};

export default UploadPage;