// BackgroundImage.tsx
import Image from "next/image";

const imageSrc = "https://avkhdvyjcweghosyfiiw.supabase.co/storage/v1/object/public/misc/pg-bg.jpg"


export default function Background() {
    return (
      <Image className="-z-100"
        alt="Mountains"
        src={imageSrc}
        placeholder="blur"
        quality={100}
        fill
        sizes="100vw"
        style={{
          objectFit: 'cover',
        }}
      />
    )
  }
  