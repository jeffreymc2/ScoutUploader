import { NextResponse } from 'next/server';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { supabaseBrowser } from '@/lib/supabase/browser';

export async function POST(request: Request) {
  const { videoPath } = await request.json();

  const ffmpeg = new FFmpeg();
  await ffmpeg.load();

  const inputVideoName = 'input.mp4';
  const outputVideoName = 'output.mp4';
  const outputThumbnailName = 'thumbnail.jpg';

  // Fetch the video file from Supabase storage
  const videoFile = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${videoPath}`);
  const videoData = await videoFile.arrayBuffer();

  // Write the video file to the FFmpeg virtual filesystem
  await ffmpeg.writeFile(inputVideoName, new Uint8Array(videoData));

  // Run FFmpeg commands to compress the video and generate a thumbnail
  await ffmpeg.exec(['-i', inputVideoName, '-vf', 'scale=-2:720', '-c:v', 'libx264', '-preset', 'fast', '-crf', '23', outputVideoName]);
  await ffmpeg.exec(['-i', inputVideoName, '-ss', '00:00:01', '-vframes', '1', outputThumbnailName]);

  // Read the compressed video and thumbnail from the FFmpeg virtual filesystem
  const compressedVideoData = await ffmpeg.readFile(outputVideoName);
  const thumbnailData = await ffmpeg.readFile(outputThumbnailName);

  // Upload the compressed video and thumbnail to Supabase storage
  const supabase = supabaseBrowser();

  const compressedVideoPath = videoPath.replace('.mp4', '_compressed.mp4');
  const thumbnailPath = videoPath.replace('.mp4', '_thumbnail.jpg');

  await supabase.storage
    .from('media')
    .upload(compressedVideoPath, compressedVideoData, {
      contentType: 'video/mp4',
    });

  await supabase.storage
    .from('media')
    .upload(thumbnailPath, thumbnailData, {
      contentType: 'image/jpeg',
    });

  await ffmpeg.terminate();

  return NextResponse.json({ message: 'Video processing completed' });
}