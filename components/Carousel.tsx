"use client";

import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { Post } from "../lib/types/types";
import Image from "next/image";
import { Card } from "./ui/card";

const Carousel: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  const supabase = supabaseBrowser();

  useEffect(() => {
    const fetchPosts = async () => {
      const { data: posts, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false })
        .eq("post_type", "image");

      if (error) {
        console.error("Error fetching posts:", error);
      } else {
        setPosts(posts as Post[]);
      }
    };

    fetchPosts();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 3,
    autoplay: true,
    autoplaySpeed: 3000,
    className: "center",
    centerMode: true,
    centerPadding: "60px",

    rows: 2,
    slidesPerRow: 2
    // responsive: [
    //     {
    //       breakpoint: 1024,
    //       settings: {
    //         slidesToShow: 3,
    //         slidesToScroll: 3,
    //         infinite: true,
    //         dots: true
    //       }
    //     },
    //     {
    //       breakpoint: 600,
    //       settings: {
    //         slidesToShow: 2,
    //         slidesToScroll: 2,
    //         initialSlide: 1,
    //         dots: false,
    //       }
    //     },
    //     {
    //       breakpoint: 480,
    //       settings: {
    //         slidesToShow: 2,
    //         slidesToScroll: 2,
    //         dots: false,

    //       }
    //     }
    //   ]
  };

  return (
    <Slider {...settings} className="w-full mx-auto">
      {posts.map((post) => (
        <Card>
          <div key={post.id}>
            <div className="flex aspect-square items-center justify-center p-4">
              <Image
                className="object-contain w-full h-full rounded-lg"
                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${post.post_by}/${post.player_id}/${post.name}`}
                alt={post.name}
                width={500}
                height={600}
                style={{
                  aspectRatio: "700/600",
                  objectFit: "cover",
                }}
              />
            </div>
          </div>
        </Card>
      ))}
    </Slider>
  );
};

export default Carousel;
