// pages/api/processVideo.js
import { NextResponse } from 'next/server';

import { supabaseBrowser } from '@/lib/supabase/browser';
import fs from 'fs';
import { exec } from 'child_process';
import util from 'util';
import path from 'path';

const execPromise = util.promisify(exec);

// Initialize Supabase client

const supabase = supabaseBrowser();

export async function POST(req: any, res: any) {
    //get request
  
  const { videoPath } = await req.body;
  if (!videoPath) {
    return res.status(400).json({ error: 'Video path is required' });
  }

  // Define paths for the downloaded video, compressed video, and thumbnail
  const tmpDir = '/tmp';
  const originalFilePath = path.join(tmpDir, path.basename(videoPath));
  const compressedFilePath = originalFilePath.replace(/\.\w+$/, '-compressed.mp4');
  const thumbnailPath = originalFilePath.replace(/\.\w+$/, '.jpg');

  try {
    // Download the video from Supabase Storage
    const { data, error: downloadError } = await supabase.storage.from('media').download(videoPath);
    if (downloadError) throw new Error(`Failed to download video: ${downloadError.message}`);

    const dataArray = await data.arrayBuffer();
    const uint8Array = new Uint8Array(dataArray);
    fs.writeFileSync(originalFilePath, uint8Array);

    // Compress the video and generate a thumbnail
    await execPromise(`ffmpeg -i ${originalFilePath} -vcodec h264 -acodec mp2 ${compressedFilePath}`);
    await execPromise(`ffmpeg -i ${originalFilePath} -ss 00:00:01.000 -vframes 1 ${thumbnailPath}`);

    // Upload the compressed video and thumbnail back to Supabase Storage
    const compressedVideoBuffer = fs.readFileSync(compressedFilePath);
    const thumbnailBuffer = fs.readFileSync(thumbnailPath);
    
    const uploadPath = videoPath.replace(/\.\w+$/, ''); // Remove file extension

    await supabase.storage.from('media').upload(`${uploadPath}-compressed.mp4`, compressedVideoBuffer);
    await supabase.storage.from('media').upload(`${uploadPath}.jpg`, thumbnailBuffer);

    // Cleanup local files
    fs.unlinkSync(originalFilePath);
    fs.unlinkSync(compressedFilePath);
    fs.unlinkSync(thumbnailPath);

    res.status(200).json({ message: 'Video processed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
