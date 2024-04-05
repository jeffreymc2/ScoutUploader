import React from "react";

const SkeletonLoader = () => {
  return (
    <div className="mt-1 flow-root px-6 py-6 animate-pulse">
      <div className="-my-6 divide-y divide-gray-500/10">
        <div className="space-y-2 py-6">
          {/* Mimic each navigation item with a skeleton block */}
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 bg-gray-300 text-xl font-pgFont h-10 w-3/4"></div>
          ))}
        </div>
        <div className="py-6">
          {/* Mimic the Profile component skeleton */}
          <div className="h-20 w-full bg-gray-300 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
