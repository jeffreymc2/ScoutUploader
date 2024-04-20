'use client';
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/browser';
import { toast } from 'sonner';
import useUser from '@/app/hook/useUser';
import Uppy from '@uppy/core';
import Tus from '@uppy/tus';

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

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setIsUploading(true);

    const uppy = new Uppy({
      meta: { type: 'avatar' },
      restrictions: { maxNumberOfFiles: 1 },
      autoProceed: true,
    });

    uppy.use(Tus, { endpoint: 'https://tusd.tusdemo.net/files/' });

    uppy.on('complete', async (result) => {
      const file = result.successful[0];
      const player_id = playerid.toString();
      const fileNameWithUUID = `${player_id}_${file.name}`;

      try {
        // Upload file to Supabase storage
        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(`players/${user?.id}/${player_id}/${fileNameWithUUID}`, file.data, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          console.error('Error uploading file to Supabase:', uploadError);
        } else {
          console.log('File uploaded to Supabase storage');
        }

        // Upload file to Mux
        const formData = new FormData();
        formData.append('file', file.data);

        const muxResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!muxResponse.ok) {
          console.error('Error uploading file to Mux:', muxResponse.statusText);
        } else {
          const muxData = await muxResponse.json();

          // Insert asset details into Supabase
          const { error: insertError } = await supabase.from('posts').insert({
            name: file.name,
            post_type: file.type,
            mux_asset_id: muxData.data.id,
            mux_playback_id: muxData.data.playback_ids[0].id,
          });

          if (insertError) {
            console.error('Error inserting asset details into Supabase:', insertError);
          } else {
            console.log('Asset details inserted into Supabase');
          }
        }
      } catch (error) {
        console.error('Error processing file:', error);
      }

      uppy.close();
      setIsUploading(false);
      toast.success('Upload complete!');
      if (window.location.pathname.includes('/players')) {
        window.location.reload();
      }
    });

    acceptedFiles.forEach((file) => {
      uppy.addFile({
        name: file.name,
        type: file.type,
        data: file,
      });
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="space-y-5">
      <div className="space-y-5">
        <h1 className="font-pgFont text-2xl">Perfect Game Scout Profile Uploader</h1>
        <div>
          <p>Selected Player: {FullName} | Player ID: {playerid}</p>
        </div>
      </div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed p-4 ${
          isDragActive ? 'border-blue-500' : 'border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag and drop some files here, or click to select files</p>
        )}
      </div>
      {isUploading && <p>Uploading...</p>}
    </div>
  );
};

export default UploadPage;