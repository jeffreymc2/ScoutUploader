// components/DiamondKastVideo.tsx
"use client";
import React, { useEffect, useState } from 'react';
import { supabaseBrowser } from "@/lib/supabase/browser";
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

interface DiamondKastVideoProps {
  playerID: number;
}

const DiamondKastVideo: React.FC<DiamondKastVideoProps> = ({ playerID }) => {
  const [playerData, setPlayerData] = useState(null);
  const [posts, setPosts] = useState(null);
  const [diamondKastVideoUrl, setDiamondKastVideoUrl] = useState('');

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/players?playerID=${playerID}`
      );
      const data = await response.json();
      setPlayerData(data);

      const supabase = supabaseBrowser();
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select("*")
        .eq("player_id", data.PlayerID)
        .order("created_at", { ascending: false });

      if (!postsError) {
        setPosts(postsData);
      } else {
        console.error("Error fetching posts:", postsError);
      }

      setDiamondKastVideoUrl(
        `https://dk.perfectgame.org/players/${data.PlayerID}?ms=638479303817445795&amp;sk=5p030Qdbe1E=&amp;hst=`
      );
    }

    fetchData();
  }, [playerID]);

  if (!playerData || !posts) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="min-h-[500px] min-w-[700px] mt-4">
      <CardHeader className="mb-0 py-5 px-5">
        <Image
          src="https://avkhdvyjcweghosyfiiw.supabase.co/storage/v1/object/public/misc/dkPlus_horizontal_primary%20(3).png"
          alt="DiamondKast Logo"
          width={300}
          height={500}
          className="rounded-md object-cover object-center mb-2"
        />
      </CardHeader>
      <CardContent className="mt-0">
        <iframe
          src={diamondKastVideoUrl}
          className="w-full h-[450px] mt-0 rounded-md"
          frameBorder="0"
          allowFullScreen
          name="638479303817445795"
        />
      </CardContent>
    </Card>
  );
};

export default DiamondKastVideo;