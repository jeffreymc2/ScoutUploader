// app/components/SearchBar.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleFilter = () => {
    // Implement filter functionality
    console.log(`Applying filters with search query: ${searchQuery}`);
  };

  return (
    <div className="flex space-x-2">
      <Input
        className="flex-1"
        placeholder="Search"
        value={searchQuery}
        onChange={handleSearch}
      />
      <Button variant="outline" onClick={handleFilter}>
        Filters
      </Button>
    </div>
  );
}