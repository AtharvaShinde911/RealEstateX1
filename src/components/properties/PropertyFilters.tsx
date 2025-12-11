import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { PropertyFilters as Filters, PropertyStatus, PropertyType } from "@/hooks/useProperties";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";

interface PropertyFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

const statusOptions: { value: PropertyStatus | "all"; label: string }[] = [
  { value: "all", label: "All Statuses" },
  { value: "draft", label: "Draft" },
  { value: "pending_approval", label: "Pending Approval" },
  { value: "active", label: "Active" },
  { value: "sold", label: "Sold" },
  { value: "rejected", label: "Rejected" },
];

const typeOptions: { value: PropertyType | "all"; label: string }[] = [
  { value: "all", label: "All Types" },
  { value: "house", label: "House" },
  { value: "apartment", label: "Apartment" },
  { value: "condo", label: "Condo" },
  { value: "townhouse", label: "Townhouse" },
  { value: "land", label: "Land" },
  { value: "commercial", label: "Commercial" },
];

export function PropertyFilters({ filters, onFiltersChange }: PropertyFiltersProps) {
  const [priceRange, setPriceRange] = useState([filters.minPrice || 0, filters.maxPrice || 5000000]);

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values);
  };

  const applyPriceFilter = () => {
    onFiltersChange({
      ...filters,
      minPrice: priceRange[0] || undefined,
      maxPrice: priceRange[1] === 5000000 ? undefined : priceRange[1],
    });
  };

  const clearFilters = () => {
    setPriceRange([0, 5000000]);
    onFiltersChange({});
  };

  const hasActiveFilters = filters.search || filters.status || filters.propertyType || filters.minPrice || filters.maxPrice;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by title or address..."
          value={filters.search || ""}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value || undefined })}
          className="pl-9"
        />
      </div>

      <Select
        value={filters.status || "all"}
        onValueChange={(value) => onFiltersChange({ ...filters, status: value as PropertyStatus | "all" })}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.propertyType || "all"}
        onValueChange={(value) => onFiltersChange({ ...filters, propertyType: value as PropertyType | "all" })}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Property Type" />
        </SelectTrigger>
        <SelectContent>
          {typeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Price Range</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            <div className="space-y-4">
              <Label>Price Range</Label>
              <Slider
                value={priceRange}
                onValueChange={handlePriceChange}
                max={5000000}
                min={0}
                step={50000}
                className="mt-2"
              />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>${priceRange[0].toLocaleString()}</span>
                <span>${priceRange[1].toLocaleString()}+</span>
              </div>
            </div>
            <Button onClick={applyPriceFilter} className="w-full">
              Apply Price Filter
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <X className="mr-1 h-4 w-4" />
          Clear
        </Button>
      )}
    </div>
  );
}