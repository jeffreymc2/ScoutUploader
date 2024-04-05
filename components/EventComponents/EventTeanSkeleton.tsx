// components/SkeletonLoader.tsx
import React from "react";
import clsx from "clsx";

interface SkeletonLoaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const EventSkeletonLoader: React.FC<SkeletonLoaderProps> = ({ className, ...props }) => {
  return (
    <div
      className={clsx(
        "bg-gray-200 animate-pulse",
        className
      )}
      {...props}
    />
  );
};

export default EventSkeletonLoader;