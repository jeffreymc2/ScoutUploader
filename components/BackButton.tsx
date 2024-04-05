// components/BackButton.js
"use client";
import { Slash } from "lucide-react";
import { useRouter } from "next/navigation"; // Correct import path
import { IoMdArrowBack } from "react-icons/io"; // Import a back arrow icon
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";

const BackButton = () => {
  const router = useRouter();

  return (
    
    <div className="flex items-center justify-start p-2 rounded-full text-sm">

    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
        </BreadcrumbSeparator>
        <BreadcrumbItem>
        <BreadcrumbLink href="/players">Players</BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
    </div>
  );
};

export default BackButton;
