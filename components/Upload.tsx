'use client';

import React, { useRef, useState, useEffect } from 'react';
import Uppy from '@uppy/core';
import { Dashboard } from '@uppy/react';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';
import { Button } from '../components/ui/button';
import XHRUpload from '@uppy/xhr-upload';
import useUser from '@/app/hook/useUser';
import { supabaseBrowser } from '@/lib/supabase/browser';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

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

  useEffect(() => {
    setSelectedPlayer({ playerid, FullName });
  }, [playerid, FullName]);

  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [uppy] = useState(() =>
    new Uppy({
      restrictions: {
        maxNumberOfFiles: 50,
        allowedFileTypes: ['image/*', 'video/*'],
        maxFileSize: 5 * 10000 * 10000,
      },
      debug: true,
    }).use(XHRUpload, {
      endpoint: '/api/upload',
      fieldName: 'files',
    })
  );

  uppy.on('file-added', async (file) => {
    const player_id = playerid.toString();
    const fileNameWithUUID = `${player_id}_${file.name}`;

    await supabase.storage
      .from('media')
      .upload(`players/${user?.id}/${player_id}/${fileNameWithUUID}`, file.data, {
        cacheControl: '3600',
        upsert: false,
      });
  });

  uppy.on('complete', (result) => {
    console.log('Upload result:', result);
    toast.success('Upload complete!');
    if (window.location.pathname.includes('/players')) {
      window.location.reload();
    }
  });

  const handleUpload = () => {
    if (!selectedPlayer) {
      toast.error('Please select a player.');
      return;
    }
    if (uppy.getFiles().length === 0) {
      toast.error('Please select a file to upload.');
      return;
    }
    uppy.upload();
  };

  return (
    <div className="space-y-5">
      <div className="space-y-5">
        <h1 className="font-pgFont text-2xl">Perfect Game Scout Profile Uploader</h1>
        <div>
          <p>Selected Player: {FullName} | Player ID: {playerid}</p>
        </div>
      </div>
      <Dashboard uppy={uppy} className="w-auto" hideUploadButton />
      <Button
        id="upload-trigger"
        className="px-4 py-2 ml-2 w-full font-medium tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-800"
        onClick={handleUpload}
      >
        Upload
      </Button>
    </div>
  );
};

export default UploadPage;