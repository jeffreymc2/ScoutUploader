import { serve } from 'https://deno.land/std/http/server.ts';
import * as ffmpeg from "https://deno.land/x/ffmpeg@v0.0.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req: { method: string; json: () => PromiseLike<{ videoPath: any; }> | { videoPath: any; }; }) => {
  if (req.method === 'POST') {
    try {
      const { videoPath } = await req.json();

      const ffmpegInstance = ffmpeg.create({ log: true });
      await ffmpegInstance.load();

      console.log('Fetching video file from Supabase storage...');
      const videoFileResponse = await supabase.storage.from('media').getPublicUrl(videoPath);
      const videoFile = await fetch(videoFileResponse.data.publicUrl);

      console.log('Reading video file data...');
      const videoData = await videoFile.arrayBuffer();

      ffmpegInstance.writeFile('input.mp4', new Uint8Array(videoData));

      console.log('Compressing video...');
      await ffmpegInstance.run('-i', 'input.mp4', '-vf', 'scale=-2:720', '-c:v', 'libx264', '-preset', 'fast', '-crf', '23', 'output.mp4');

      console.log('Generating thumbnail...');
      await ffmpegInstance.run('-i', 'input.mp4', '-ss', '00:00:01', '-vframes', '1', 'thumbnail.jpg');

      console.log('Reading compressed video data...');
      const compressedVideoData = ffmpegInstance.readFile('output.mp4');

      console.log('Reading thumbnail data...');
      const thumbnailData = ffmpegInstance.readFile('thumbnail.jpg');

      const compressedVideoPath = videoPath.replace('.mp4', '_compressed.mp4');
      const thumbnailPath = videoPath.replace('.mp4', '_thumbnail.jpg');

      console.log('Uploading compressed video to Supabase storage...');
      await supabase.storage.from('media').upload(compressedVideoPath, compressedVideoData, { contentType: 'video/mp4' });

      console.log('Uploading thumbnail to Supabase storage...');
      await supabase.storage.from('media').upload(thumbnailPath, thumbnailData, { contentType: 'image/jpeg' });

      return new Response(JSON.stringify({ message: 'Video processing completed' }), { headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
      console.error('Error processing video:', error);
      return new Response(JSON.stringify({ error: 'Failed to process video' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  } else {
    return new Response('Method not allowed', { status: 405 });
  }
});