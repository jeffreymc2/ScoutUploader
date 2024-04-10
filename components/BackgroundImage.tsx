// BackgroundImage.tsx
import Image from "next/image";
import BackgroundVideo from 'next-video/background-video';

const imageSrc =
  "https://avkhdvyjcweghosyfiiw.supabase.co/storage/v1/object/public/misc/pg-bg.jpg";

  const imageStyle = {
    zIndex: -100,
    position: "fixed",
    width: "100%",
    height: "100%",
  }

export default function Background() {
    const imageStyle: React.CSSProperties = {
        zIndex: -10,
        width: "100%",
    };

    return (
        <div className="fixed top-0 left-0 w-screen h-screen -z-100 "style={imageStyle}>
        {/* <Image
            className=" min-h-fit	 w-screen object-cover fixed top-0 left-0 flex-grow h"
            alt="PG Background Image"
            src={imageSrc}
            quality={100}
            fill
            
        /> */}
         <BackgroundVideo src="https://avkhdvyjcweghosyfiiw.supabase.co/storage/v1/object/public/misc/15afdd15-e0a3-4488-804f-0c551cd3bacc.mp4?t=2024-04-10T23%3A52%3A29.686Z" />
        </div>
    );
}
