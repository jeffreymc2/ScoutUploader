// components/BackButton.js
"use client";
import { useRouter } from 'next/navigation'; // Correct import path
import { IoMdArrowBack } from 'react-icons/io'; // Import a back arrow icon

const BackButton = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center justify-center p-2 rounded-full text-sm"
      aria-label="Go back"
      title="Go back"
    >
      <IoMdArrowBack className="text-sm" onClick={() => router.back()}
      aria-label="Go back"
      title="Go back"/>
       Back
    </button>
  );
};

export default BackButton;
