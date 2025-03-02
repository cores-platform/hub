import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';

interface SearchAndFilterProps {
  onFilterChange: (filters: { category?: string; search?: string }) => void;
  initialCategory?: string;
  initialSearch?: string;
}

export function SearchAndFilter({
  onFilterChange,
  initialCategory = '',
  initialSearch = '',
}: SearchAndFilterProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setSearchTerm(initialSearch);
    setCategory(initialCategory);
  }, [initialSearch, initialCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ search: searchTerm });
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    onFilterChange({ category: value });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setCategory('');
    onFilterChange({ category: '', search: '' });
  };

  return (
    <div className="space-y-4">
      <form
        onSubmit={handleSearchSubmit}
        className="flex items-center gap-2"
      >
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            type="search"
            placeholder="동아리 검색..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button type="submit">검색</Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-1"
        >
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline">필터</span>
        </Button>
      </form>

      {showFilters && (
        <div className="p-4 border rounded-md bg-card dark:bg-gray-800/60 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">카테고리</Label>
              <Select
                value={category}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="모든 카테고리" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">모든 카테고리</SelectItem>
                  <SelectItem value="학술">학술</SelectItem>
                  <SelectItem value="취미">취미</SelectItem>
                  <SelectItem value="운동">운동</SelectItem>
                  <SelectItem value="문화">문화</SelectItem>
                  <SelectItem value="봉사">봉사</SelectItem>
                  <SelectItem value="종교">종교</SelectItem>
                  <SelectItem value="기타">기타</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              variant="ghost"
              onClick={handleClearFilters}
              className="text-sm"
            >
              필터 초기화
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
