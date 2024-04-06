// components/ScreenRecorder.tsx
"use client";
import React, { useState, useRef } from 'react';
import { supabaseBrowser } from '@/lib/supabase/browser';
import { Button } from '@/components/ui/button';
import { User } from '@/app/hook/useUser';

interface ScreenRecorderProps {
  playerID: number;
  user: User | null;
}

const ScreenRecorder: React.FC<ScreenRecorderProps> = ({ playerID, user }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const dkplusElement = document.getElementById('dkplus');
      if (!dkplusElement) return;

      const { left, top, width, height } = dkplusElement.getBoundingClientRect();

      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: 620,
          height: 350,
          x: Math.round(left),
          y: Math.round(top),
        },
        audio: true,
      });

      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm',
      });

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.ondataavailable = (event) => {
        recordedChunksRef.current.push(event.data);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting screen recording:', error);
    }
  };

  const stopRecording = async () => {
    try {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        const blob = new Blob(recordedChunksRef.current, {
          type: 'video/webm',
        });
        await uploadToSupabase(blob, user?.id, playerID.toString());
        setIsRecording(false);
        mediaRecorderRef.current = null;
        recordedChunksRef.current = [];
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      }
    } catch (error) {
      console.error('Error stopping screen recording:', error);
    }
  };

  const uploadToSupabase = async (blob: Blob, userId: string, playerId: string) => {
    try {
      const supabase = supabaseBrowser();
      const { data, error } = await supabase.storage
        .from('images')
        .upload(`${userId}/${playerId}/${Date.now()}.webm`, blob, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        console.error('Error uploading screen recording to Supabase:', error);
      } else {
        console.log('Screen recording uploaded to Supabase:', data);
      }
    } catch (error) {
      console.error('Error uploading screen recording to Supabase:', error);
    }
  };

  return (
    <div>
      <Button
        onClick={isRecording ? stopRecording : startRecording}
        className="px-4 py-2 font-medium tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-800"
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </Button>
    </div>
  );
};

export default ScreenRecorder;