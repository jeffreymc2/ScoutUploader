"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


interface LoadingButtonProps {
    onClick: () => Promise<void>;
    isLoading: boolean;
    children: React.ReactNode;
  }

const VideoClipperForm = () => {
  const [inputFile, setInputFile] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [outputFile, setOutputFile] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const LoadingButton: React.FC<LoadingButtonProps> = ({
    onClick,
    isLoading,
    children,
  }) => {
    return (
      <Button onClick={onClick} disabled={isLoading}>
        {isLoading ? "Loading..." : children}
      </Button>
    );
  };
  

  const handleClipVideo = async () => {
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch(`/api/clipvideo?inputFile=${encodeURIComponent(inputFile)}&startTime=${startTime}&endTime=${endTime}&outputFile=${encodeURIComponent(outputFile)}`, {
        method: "POST",
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        const { error } = await response.json();
        setError(error);
      }
    } catch (err) {
      console.error("Error clipping video:", err);
      setError("An error occurred while clipping the video.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Input
        type="text"
        value={inputFile}
        onChange={(e) => setInputFile(e.target.value)}
        placeholder="Input File Path or URL"
      />
      <div className="flex gap-4">
        <Input
          type="text"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          placeholder="Start Time (seconds)"
        />
        <Input
          type="text"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          placeholder="End Time (seconds)"
        />
      </div>
      <Input
        type="text"
        value={outputFile}
        onChange={(e) => setOutputFile(e.target.value)}
        placeholder="Output File Path"
      />




<LoadingButton onClick={handleClipVideo} isLoading={isLoading}>
        Clip Video
      </LoadingButton>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">Video clipping successful!</p>}
    </div>
  );
};

export default VideoClipperForm;

