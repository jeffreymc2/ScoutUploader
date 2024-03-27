//app/components/PlayerSearch.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import DeletePost from '@/components/DeletePost';
import { useRouter } from 'next/navigation'; // Corrected from 'next/navigation' to 'next/router'
import { Input } from './ui/input';
import { Button } from './ui/button';

import { IoIosCloseCircleOutline } from "react-icons/io";
import { toast } from 'sonner';

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
    
    router.push(searchQuery ? `/players/${encodeURIComponent(searchQuery)}` : '/');
    if (!searchQuery.trim()) {
      toast.info('Please enter a Player Id to search.');
      return;
    }


  };

  return (
    <div className="mt-5">
    <div className="flex items-center w-full relative">
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
      
    </div>
  );
}
