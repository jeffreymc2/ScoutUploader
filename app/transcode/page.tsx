// pages/transcode.tsx
"use client";
import { useState } from "react";
import VideoClipperForm from "@/components/MediaComponents/VideoClipper";

export default function TranscodePage() {
  const [isTranscoding, setIsTranscoding] = useState(false);
  const [transcodingResult, setTranscodingResult] = useState(null);

  const handleTranscode = async () => {
    setIsTranscoding(true);
    try {
      const response = await fetch("/api/transcode", {
        method: "POST",
      });
      const data = await response.json();
      setTranscodingResult(data);
    } catch (error) {
      console.error("Error initiating transcoding:", error);
    }
    setIsTranscoding(false);
  };

  return (
    <div>
      <h1>Transcoding Test</h1>
      <button onClick={handleTranscode} disabled={isTranscoding}>
        {isTranscoding ? "Transcoding..." : "Start Transcoding"}
      </button>
      {transcodingResult && (
        <div>
          <h2>Transcoding Result:</h2>
          <pre>{JSON.stringify(transcodingResult, null, 2)}</pre>
          <VideoClipperForm />

        </div>
      )}
    </div>
  );
}