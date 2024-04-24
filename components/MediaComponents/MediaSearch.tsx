

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchComponentProps {
  onSearch: (searchTerm: string, filterOption: string) => void;
}

const SearchComponent: React.FC<SearchComponentProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOption, setFilterOption] = useState("all");

  const handleSearch = () => {
    onSearch(searchTerm, filterOption);
  };

  return (
    <div className="flex items-center gap-4">

      <Input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
        className="w-full max-w-xs"
      />
      <Select
        value={filterOption}
        onValueChange={(value) => setFilterOption(value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Filter" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="highlights">Highlights</SelectItem>
          <SelectItem value="scoutUploads">Scout Uploads</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={handleSearch}>Search</Button>
    </div>
  );
};

export default SearchComponent;
