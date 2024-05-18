import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import AWS from 'aws-sdk';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const s3 = new AWS.S3({
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  region: process.env.NEXT_PUBLIC_AWS_REGION,
});

export async function POST(request: NextRequest) {
  const { postId, filePath } = await request.json();

  if (!postId || !filePath) {
    return NextResponse.json({ message: 'Missing postId or filePath' }, { status: 400 });
  }

  try {
    // Delete the post from Supabase
    const { error: deleteError } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);

    if (deleteError) {
      throw new Error(deleteError.message);
    }

    // Delete the file from S3
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: filePath,
    };

    await s3.deleteObject(params).promise();

    return NextResponse.json({ message: 'Post and file deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting post or file:', error);
    return NextResponse.json({ message: 'Error deleting post or file', error }, { status: 500 });
  }
}
