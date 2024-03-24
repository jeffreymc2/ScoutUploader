// components/PlayerSearch.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import DeletePost from '@/components/DeletePost';
import { useRouter } from 'next/navigation'; // Corrected from 'next/navigation' to 'next/router'
import { Input } from './ui/input';
import { Button } from './ui/button';

import { IoIosCloseCircleOutline } from "react-icons/io";

interface Post {
  created_at: string;
  player_id: string | null;
  id: string;
  name: string;
  object_id: string;
  post_by: string;
  profiles: {
    display_name: string | null;
  } | null;
  image: string;
}

interface PlayerSearchProps {
  posts: Post[];
}

const imgeUrlHost = 'https://rfgveuhgzxqkaualspln.supabase.co/storage/v1/object/public/images/';

export default function PlayerSearch({ posts }: PlayerSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    router.push(searchQuery ? `/?player_id=${encodeURIComponent(searchQuery)}` : '/');
  };

  return (
    <div className="mt-10">
      <div className="flex items-center w-1/3 relative">
    <Input
      type="text"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Search player by Player ID"
      className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md"
    />
    {searchQuery && (
      <button
        onClick={() => {
          setSearchQuery(''); // Clear the input
          // handleSearch(); // Uncomment if you decide to trigger search immediately
        }}
        className="absolute right-20 top-1/2 mr-5 transform -translate-y-1/2 flex items-center justify-center text-gray-400 hover:text-gray-600"
      >
        <IoIosCloseCircleOutline className="w-6 h-6" />
      </button>
    )}
    <Button onClick={handleSearch} className="ml-2 flex-shrink-0">Search</Button>
  </div>
      <div className="grid grid-cols-3 gap-10 mt-10">
        {posts.map((post) => (
          <div key={post.id} className="rounded-md w-full space-y-5 relative">
            <div className="w-full h-96 relative rounded-md border">
              <Image
                src={imgeUrlHost + post.image}
                alt={post.player_id || ''}
                fill
                className="rounded-md object-cover object-center"
              />
            </div>
            <p className="text-xs">Posted by: @{post.profiles?.display_name}</p>
            <p className="text-lg font-pgFont">Player Id: {post.player_id}</p>
            <DeletePost post_by={post.post_by} image={post.image} />
          </div>
        ))}
      </div>
    </div>
  );
}
