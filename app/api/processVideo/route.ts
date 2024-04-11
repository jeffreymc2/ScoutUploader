// app/api/processVideo/route.ts
import { NextResponse } from 'next/server';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { supabaseServer } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const { videoPath } = await request.json();

  console.log('Received video path:', videoPath);

  const ffmpeg = new FFmpeg();
  ffmpeg.on('log', (log) => {
    console.log('FFmpeg Log:', log.message);
  });

  console.log('Loading FFmpeg...');
  await ffmpeg.load();
  console.log('FFmpeg loaded successfully');

  const inputVideoName = 'input.mp4';
  const outputVideoName = 'output.mp4';
  const outputThumbnailName = 'thumbnail.jpg';

  try {
    console.log('Fetching video file from Supabase storage...');
    // const videoFile = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${videoPath}`);
    const videoFileResponse = await supabaseServer().storage.from('media').getPublicUrl(videoPath);
    const videoFile = await fetch(videoFileResponse.data.publicUrl);
    
    console.log('Video file fetched successfully');

    console.log('Reading video file data...');
    const videoData = await videoFile.arrayBuffer();
    console.log('Video file data read successfully');

    console.log('Writing video file to FFmpeg virtual filesystem...');
    await ffmpeg.writeFile(inputVideoName, new Uint8Array(videoData));
    console.log('Video file written to FFmpeg virtual filesystem');

    console.log('Compressing video...');
    await ffmpeg.exec(['-i', inputVideoName, '-vf', 'scale=-2:720', '-c:v', 'libx264', '-preset', 'fast', '-crf', '23', outputVideoName]);
    console.log('Video compression completed');

    console.log('Generating thumbnail...');
    await ffmpeg.exec(['-i', inputVideoName, '-ss', '00:00:01', '-vframes', '1', outputThumbnailName]);
    console.log('Thumbnail generation completed');

    console.log('Reading compressed video data...');
    const compressedVideoData = await ffmpeg.readFile(outputVideoName);
    console.log('Compressed video data read successfully');

    console.log('Reading thumbnail data...');
    const thumbnailData = await ffmpeg.readFile(outputThumbnailName);
    console.log('Thumbnail data read successfully');

    const supabase = supabaseServer();

    const compressedVideoPath = videoPath.replace('.mp4', '_compressed.mp4');
    const thumbnailPath = videoPath.replace('.mp4', '_thumbnail.jpg');

    console.log('Uploading compressed video to Supabase storage...');
    await supabase.storage
      .from('media')
      .upload(compressedVideoPath, compressedVideoData, {
        contentType: 'video/mp4',
      });
    console.log('Compressed video uploaded to Supabase storage');

    console.log('Uploading thumbnail to Supabase storage...');
    await supabase.storage
      .from('media')
      .upload(thumbnailPath, thumbnailData, {
        contentType: 'image/jpeg',
      });
    console.log('Thumbnail uploaded to Supabase storage');

    console.log('Terminating FFmpeg...');
    await ffmpeg.terminate();
    console.log('FFmpeg terminated');

    return NextResponse.json({ message: 'Video processing completed' });
  } catch (error) {
    console.error('Error processing video:', error);
    return NextResponse.json({ error: 'Failed to process video' }, { status: 500 });
  }
}